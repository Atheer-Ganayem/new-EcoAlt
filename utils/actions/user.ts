"use server";

import { getServerSession } from "next-auth";
import { Res, notAuthorized, notFound, serverSideError } from "../http-helpers";
import { authOptions } from "../authOptions";
import User from "@/models/User";
import { connectDB } from "../connectDB";
import { UserDoc } from "@/types/mongoModels";
import { revalidatePath } from "next/cache";
import { isEmail } from "../helpers";
import { S3 } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";

const s3 = new S3({
  region: "eu-central-1",
});

interface ChangeDetailsData {
  userId: string;
  name: string;
  email: string;
  avatar: File;
}

export const updateUserDetails: (prev: any, formData: FormData) => Promise<Res> = async (
  _,
  formData
) => {
  try {
    const data = extactDetailsData(formData);
    const validationMessage = detailsValidate(data);
    if (validationMessage) {
      return { error: true, message: validationMessage, code: 422 };
    }

    const session = await getServerSession(authOptions);
    if (!session) {
      return notAuthorized();
    }

    await connectDB();
    const currentUser = (await User.findById(session.user.id).select("isAdmin")) as UserDoc;
    const targetUser = (await User.findById(data.userId).select("name email avatar")) as UserDoc;
    if (!currentUser) {
      return notFound();
    } else if (!currentUser.isAdmin && currentUser._id.toString() !== targetUser._id.toString()) {
      return notAuthorized();
    }

    if (data.email) {
      const existingEmail = (await User.findOne({ email: data.email }).select("_id")) as UserDoc;
      if (existingEmail) {
        return { error: true, code: 422, message: "Email already exists, choose another one." };
      }
      targetUser.email = data.email;
    }
    targetUser.name = data.name || targetUser.name;

    if (data.avatar.size > 0) {
      s3.deleteObject({
        Bucket: "eco-alt-project",
        Key: targetUser.avatar,
      });

      const bufferedImage = await data.avatar.arrayBuffer();
      const filename = "avatar-" + uuidv4() + "." + data.avatar.name.split(".").pop();

      await s3.putObject({
        Bucket: "eco-alt-project",
        Key: filename,
        Body: Buffer.from(bufferedImage),
        ContentType: data.avatar.type,
      });

      targetUser.avatar = filename;
    }

    targetUser.save();

    revalidatePath(`/users/${targetUser._id.toString()}`);
    revalidatePath("/admin/users");

    return {
      error: false,
      message: "User's details has been update successfully.",
      code: 201,
    };
  } catch (error) {
    return serverSideError();
  }
};

function detailsValidate({ email, name, avatar }: ChangeDetailsData): string {
  if (!name && !email && avatar.size === 0) {
    return "You must change the user's details before submittion.";
  }
  if (name && name.trim().length < 3) {
    return "Username must be at least 3 characters long.";
  }
  if (email && !isEmail(email)) {
    return "Invalid email.";
  }

  if (avatar && avatar.size > 0 && avatar.type !== "image/png" && avatar.type !== "image/jpeg") {
    return "Invalid image type. only png and jpeg are allowed.";
  }

  return "";
}

function extactDetailsData(formData: FormData): ChangeDetailsData {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const avatar = formData.get("avatar") as File;
  const userId = formData.get("userId") as string;

  return {
    name,
    email,
    avatar,
    userId,
  };
}

/// Change Password

interface ChangePasswordData {
  userId: string;
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export const changePassword: (prev: any, formData: FormData) => Promise<Res> = async (
  _,
  formData
) => {
  try {
    const data = extractChangePasswordData(formData);
    const validationMessage = changePassswordValidate(data);
    if (validationMessage) {
      return { error: true, message: validationMessage, code: 422 };
    }

    const session = await getServerSession(authOptions);
    if (!session) {
      return notAuthorized();
    }

    await connectDB();
    const currentUser = (await User.findById(session.user.id).select("isAdmin")) as UserDoc;
    const targetUser = (await User.findById(data.userId).select("password")) as UserDoc;
    if (!currentUser) {
      return notFound();
    } else if (!currentUser.isAdmin && currentUser._id.toString() !== targetUser._id.toString()) {
      return notAuthorized();
    }

    if (!currentUser.isAdmin) {
      const isPwMatch = await bcrypt.compare(data.currentPassword, targetUser.password);
      if (!isPwMatch) {
        return { error: true, code: 422, message: "Current password is Incorrect." };
      }
    }

    const isTheCurrentPassword = await bcrypt.compare(data.newPassword, targetUser.password);
    if (isTheCurrentPassword) {
      return {
        error: true,
        code: 422,
        message: "You cant change the password to the same current password.",
      };
    }

    const hashedNewPW = await bcrypt.hash(data.newPassword, 12);
    targetUser.password = hashedNewPW;
    targetUser.save();

    return {
      error: false,
      message: "User's password has been update successfully.",
      code: 201,
    };
  } catch (error) {
    return serverSideError();
  }
};

function changePassswordValidate({
  confirmNewPassword,
  currentPassword,
  newPassword,
}: ChangePasswordData): string {
  if (currentPassword.trim().length < 6) {
    return "Password length must be equal or greater than 6 characters.";
  } else if (confirmNewPassword !== newPassword) {
    return "Confirm new password must match the new password.";
  }
  return "";
}

function extractChangePasswordData(formData: FormData): ChangePasswordData {
  const userId = formData.get("userId") as string;
  const currentPassword = formData.get("currentPassword") as string;
  const newPassword = formData.get("newPassword") as string;
  const confirmNewPassword = formData.get("confirmNewPassword") as string;

  return {
    confirmNewPassword,
    currentPassword,
    newPassword,
    userId,
  };
}

// delete user

export const deleteUser: (userId: string) => Promise<Res> = async userId => {
  console.log("deleting user");

  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return notAuthorized();
    }

    await connectDB();
    const currentUser = (await User.findById(session.user.id).select("isAdmin")) as UserDoc;
    const targetUser = (await User.findById(userId).select("password avatar")) as UserDoc;
    if (!currentUser || !targetUser) {
      return notFound();
    }
    if (!currentUser.isAdmin && currentUser._id.toString() !== targetUser._id.toString()) {
      return notAuthorized();
    }

    s3.deleteObject({
      Bucket: "eco-alt-project",
      Key: targetUser.avatar,
    });

    await User.findByIdAndDelete(targetUser._id);

    return {
      error: false,
      message: "User has been deleted successfully.",
      code: 201,
    };
  } catch (error) {
    return serverSideError();
  }
};

"use server";

import { getServerSession } from "next-auth";
import { Res, notAuthorized, serverSideError } from "../http-helpers";
import { authOptions } from "../authOptions";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { S3 } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import { connectDB } from "../connectDB";
import { isEmail } from "../helpers";

const s3 = new S3({
  region: "eu-central-1",
});

interface Data {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  avatar: File;
}

interface AuthRss extends Res {
  email?: string;
  password?: string;
}

export const signup: (prevState: any, formData: FormData) => Promise<AuthRss> = async (
  _prevState,
  formData
) => {
  try {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;
    const avatar = formData.get("avatar") as File;
    const validationMessage = validate({ name, email, password, confirmPassword, avatar });
    if (validationMessage) {
      return { error: true, code: 422, message: validationMessage };
    }

    const session = await getServerSession(authOptions);
    if (session) {
      return notAuthorized();
    }

    await connectDB();

    const existingUser = await User.findOne({ email: email }).select("_id");
    if (existingUser) {
      return { error: true, code: 422, message: "Email already exists, choose another one." };
    }

    const hashedPw = await bcrypt.hash(password, 12);
    const bufferedImage = await avatar.arrayBuffer();
    const filename = "avatar-" + uuidv4() + "." + avatar.name.split(".").pop();

    await s3.putObject({
      Bucket: "eco-alt-project",
      Key: filename,
      Body: Buffer.from(bufferedImage),
      ContentType: avatar.type,
    });

    await User.create({ name, email, password: hashedPw, avatar: filename, cart: [] });

    return { error: false, message: "Account created successfully", code: 201, email, password };
  } catch (error) {
    return serverSideError();
  }
};

function validate({ name, email, password, confirmPassword, avatar }: Data): string {
  if (name.trim().length < 3) {
    return "Username must be at least 3 characters long.";
  }
  if (!isEmail(email)) {
    return "Invalid email.";
  }
  if (password.trim().length < 6) {
    return "Password must be at least 6 characters long.";
  }
  if (password !== confirmPassword) {
    return "Password and confirm password must match.";
  }
  if (avatar.type !== "image/png" && avatar.type !== "image/jpeg") {
    return "Invalid image type. only png and jpeg are allowed.";
  }

  return "";
}


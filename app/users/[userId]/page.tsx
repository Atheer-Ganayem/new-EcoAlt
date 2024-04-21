import UserDetailsCard from "@/components/user/UserDetailsCard";
import User from "@/models/User";
import { UserDoc } from "@/types/mongoModels";
import { authOptions } from "@/utils/authOptions";
import { connectDB } from "@/utils/connectDB";
import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";
import React from "react";

interface Props {
  params: {
    userId: string;
  };
}

export async function generateMetadata({ params }: Props) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      notFound();
    }

    await connectDB();
    const clientUser = (await User.findById(session.user.id)
      .select("isAdmin name")
      .lean()) as UserDoc;

    if (!clientUser) {
      notFound();
    }

    if (clientUser.isAdmin && clientUser._id.toString() !== params.userId) {
      const user = (await User.findById(params.userId).select("name").lean()) as UserDoc;
      return {
        title: "EcoAlt | " + user.name,
      };
    } else if (!clientUser.isAdmin && clientUser._id.toString() !== params.userId) {
      notFound();
    }

    const user = (await User.findById(params.userId).select("name").lean()) as UserDoc;

    return {
      title: "EcoAlt | " + user.name,
    };
  } catch (error) {
    console.log(error);

    return {
      title: "EcoAlt | Error",
    };
  }
}

const page: React.FC<Props> = async ({ params }) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    notFound();
  }

  await connectDB();
  const clientUser = (await User.findById(session.user.id)
    .select("isAdmin name email avatar")
    .lean()) as UserDoc;

  if (!clientUser.isAdmin && clientUser._id.toString() !== params.userId) {
    redirect("/");
  }

  const user = (await User.findById(params.userId)
    .select("name email avatar isAdmin")
    .lean()) as UserDoc;

  return (
    <div className="container max-w-7xl mx-auto mt-16 p-3 flex flex-col gap-10">
      <UserDetailsCard user={user} />
    </div>
  );
};

export default page;

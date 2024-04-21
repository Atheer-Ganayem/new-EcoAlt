import TableSkeleton from "@/components/UI/TableSkeleton";
import UsersTable from "@/components/admin/users/UsersTable";
import User from "@/models/User";
import { UserDoc } from "@/types/mongoModels";
import { authOptions } from "@/utils/authOptions";
import { connectDB } from "@/utils/connectDB";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React, { Suspense } from "react";

export const metadata: Metadata = {
  title: "EcoAlt | Admin Users",
};

const page = async () => {
  const session = await getServerSession(authOptions);
  if (!session || !session.user.isAdmin) {
    redirect("/");
  }

  await connectDB();
  const user = (await User.findById(session.user.id).select("isAdmin")) as UserDoc;
  if (!user.isAdmin) {
    redirect("/");
  }

  const users = (await User.find().select("name email avatar isAdmin").lean()) as UserDoc[];

  return (
    <main className="container max-w-7xl mx-auto mt-16 p-3 flex flex-col gap-10">
      <Suspense
        fallback={<TableSkeleton head={["Name", "Email", "User Type", "Options"]} rows={3} />}
      >
        <UsersTable users={users} />
      </Suspense>
    </main>
  );
};

export default page;

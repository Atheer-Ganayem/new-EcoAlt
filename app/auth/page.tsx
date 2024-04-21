import AuthPage from "@/components/auth/AuthPage";
import { authOptions } from "@/utils/authOptions";
import { Tab, Tabs } from "@nextui-org/react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

const page = async () => {
  const session = await getServerSession(authOptions);
  if (session) {
    redirect("/");
  }

  return (
    <div className="container mx-auto max-w-5xl">
      <AuthPage />
    </div>
  );
};

export default page;

import ItemsTable from "@/components/cart/ItemsTable";
import CredentialsForm from "@/components/checkout/CredentialsForm";
import User from "@/models/User";
import { ProductDoc, UserDoc } from "@/types/mongoModels";
import { authOptions } from "@/utils/authOptions";
import { connectDB } from "@/utils/connectDB";
import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";
import React from "react";

const page = async () => {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/");
  }

  await connectDB();
  const user = (await User.findById(session.user.id)
    .select("cart")
    .populate({
      path: "cart",
      populate: { path: "product", select: "images title qty rating price shippingPrice" },
    })
    .lean()) as UserDoc;

  if (!user) {
    notFound();
  }

  for (let index = 0; index < user.cart.length; index++) {
    user.cart[index].product._id = user.cart[index].product._id.toString();
    user.cart[index]._id = user.cart[index]._id!.toString();
  }

  return (
    <main className="container mx-auto mt-16 px-5">
      <ItemsTable cart={user.cart} isCheckout />
      <CredentialsForm />
    </main>
  );
};

export default page;

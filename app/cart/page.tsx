import ItemsTable from "@/components/cart/ItemsTable";
import Summary from "@/components/cart/Summary";
import User from "@/models/User";
import { ProductDoc, UserDoc } from "@/types/mongoModels";
import { authOptions } from "@/utils/authOptions";
import { connectDB } from "@/utils/connectDB";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";
import React from "react";

export const metadata: Metadata = {
  title: "EcoAlt | Cart",
};

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
      populate: {
        path: "product",
        select: "images title qty rating price shippingPrice isDeleted",
      },
    })
    .lean()) as UserDoc;

  if (!user) {
    notFound();
  }

  const updatedCart = user.cart.filter(item => !(item.product as ProductDoc).isDeleted);
  if (updatedCart.length !== user.cart.length) {
    await User.updateOne({ _id: user._id }, { $set: { cart: updatedCart } });
    user.cart = updatedCart;
  }

  for (let index = 0; index < user.cart.length; index++) {
    user.cart[index].product._id = user.cart[index].product._id.toString();
    user.cart[index]._id = user.cart[index]._id!.toString();
  }

  const totalQty = user.cart.reduce((prev, current) => prev + current.qty, 0);
  const totalProductsPrice = user.cart.reduce(
    (prev, current) => prev + current.qty * (current.product as ProductDoc).price,
    0
  );
  const totalShippingPrice = user.cart.reduce(
    (prev, current) => prev + current.qty * (current.product as ProductDoc).shippingPrice,
    0
  );

  return (
    <main className="container mx-auto mt-16 px-5">
      <ItemsTable cart={user.cart} />
      <Summary
        totalQty={totalQty}
        totalProductsPrice={totalProductsPrice}
        totalShippingPrice={totalShippingPrice}
        totalPrice={totalProductsPrice + totalShippingPrice}
      />
    </main>
  );
};

export default page;

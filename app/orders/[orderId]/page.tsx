import ItemsTable from "@/components/cart/ItemsTable";
import Info from "@/components/order/Info";
import Order from "@/models/Order";
import User from "@/models/User";
import { OrderDoc, ProductDoc, UserDoc } from "@/types/mongoModels";
import { authOptions } from "@/utils/authOptions";
import { connectDB } from "@/utils/connectDB";
import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";
import React from "react";

interface Props {
  params: { orderId: string };
}

const page: React.FC<Props> = async ({ params }) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/");
  }

  await connectDB();
  const order = (await Order.findOne({ _id: params.orderId })
    .populate({
      path: "items",
      populate: { path: "product", select: "title rating images" },
    })
    .lean()) as OrderDoc;
  const user = (await User.findById(session.user.id).select("isAdmin")) as UserDoc;
  if (!order || !user) {
    notFound();
  }

  if (order.user.toString() !== session.user.id && user.isAdmin === false) {
    notFound();
  }
  order.items = order.items.map(item => {
    const product = item.product as ProductDoc;

    return {
      qty: item.qty,
      product: {
        title: product.title,
        rating: product.rating,
        images: product.images,
        price: item.price,
        shippingPrice: item.shippingPrice,
      } as ProductDoc,
      price: item.price,
      shippingPrice: item.shippingPrice,
      _id: item._id,
    };
  });

  return (
    <main className="container max-w-7xl mx-auto mt-16 p-3 flex flex-col gap-10">
      <ItemsTable cart={order.items} isCheckout />
      <Info order={order} />
    </main>
  );
};

export default page;

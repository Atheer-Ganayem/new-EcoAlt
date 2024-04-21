import Order from "@/models/Order";
import { OrderDoc } from "@/types/mongoModels";
import React from "react";
import OrdersTable from "./OrdersTable";

interface Props {
  userId: string;
}

const Orders: React.FC<Props> = async ({ userId }) => {
  const orders = (await Order.find({ user: userId })
    .select("user items isDelivered deliveredAt createdAt")
    .populate({ path: "user", select: "name" })
    .lean()) as OrderDoc[];

  return (
    <>
      <OrdersTable orders={orders} />
    </>
  );
};

export default Orders;

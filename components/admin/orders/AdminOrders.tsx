import Order from "@/models/Order";
import { OrderDoc } from "@/types/mongoModels";
import React from "react";
import OrdersTable from "./OrdersTable";

const AdminOrders = async () => {
  const orders = (await Order.find()
    .select("user items isDelivered deliveredAt createdAt")
    .populate({ path: "user", select: "name" })
    .lean()) as OrderDoc[];

  return (
    <>
      <OrdersTable orders={orders} />
    </>
  );
};

export default AdminOrders;

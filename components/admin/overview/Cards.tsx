import Order from "@/models/Order";
import Product from "@/models/Product";
import { connectDB } from "@/utils/connectDB";
import React from "react";
import OverviewCard from "./OverviewCard";
import { DollarSign, Package, ShoppingBasket } from "lucide-react";

const Cards = async () => {
  await connectDB();

  const orders = await Order.aggregate([
    { $unwind: "$items" },
    {
      $group: {
        _id: "$_id",
        total: {
          $sum: {
            $multiply: [{ $add: ["$items.price", "$items.shippingPrice"] }, "$items.qty"],
          },
        },
        totalQuantity: { $sum: "$items.qty" },
      },
    },
    {
      $project: {
        _id: 0,
        orderId: "$_id",
        total: 1,
        totalQuantity: 1,
      },
    },
  ]);

  const totalProfit: string = orders.reduce((prev, current) => prev + current.total, 0).toFixed(2);
  const productsCount = await Product.countDocuments({ isDeleted: false });

  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      <OverviewCard
        title="Avalibale Products"
        data={productsCount + " Items"}
        icon={<ShoppingBasket className="text-primary" />}
      />
      <OverviewCard
        title="Orders Count"
        data={orders.length + " Orders"}
        icon={<Package className="text-warning" />}
      />
      <OverviewCard
        title="Items Sold"
        data={orders.reduce((prev, current) => prev + current.totalQuantity, 0) + " Items"}
        icon={<Package className="text-secondary" />}
      />
      <OverviewCard
        title="Total Revenue"
        data={"$" + totalProfit}
        icon={<DollarSign className="text-success" />}
      />
    </div>
  );
};

export default Cards;

import Order from "@/models/Order";
import React from "react";
import moment from "moment";
import Last7DaySalesChart from "./Last7DaySalesChart";

const Charts = async () => {
  const past7DaysStartDate = moment().subtract(7, "days").startOf("day");
  const past7DaysEndDate = moment().endOf("day");

  const allDates = [];
  let currentDate = moment(past7DaysStartDate);
  while (currentDate <= past7DaysEndDate) {
    allDates.push(currentDate.format("YYYY-MM-DD"));
    currentDate = currentDate.clone().add(1, "day");
  }

  const days = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: past7DaysStartDate.toDate(), $lte: past7DaysEndDate.toDate() },
      },
    },
    { $unwind: "$items" },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        total: {
          $sum: { $multiply: [{ $add: ["$items.price", "$items.shippingPrice"] }, "$items.qty"] },
        },
        totalQuantity: { $sum: "$items.qty" },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const mergedResult = allDates.map(date => {
    const found = days.find(day => day._id === date);
    return found ? found : { _id: date, total: 0, totalQuantity: 0 };
  });

  const data = mergedResult.map(day => {
    return {
      name: day._id,
      total: day.total,
    };
  });

  return (
    <div>
      <Last7DaySalesChart data={data} />
    </div>
  );
};

export default Charts;

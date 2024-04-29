"use client";

import React from "react";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

const Last7DaySalesChart = ({ data }: { data: { name: string; total: number }[] }) => {
  return (
    <>
      <h1 className="mb-8 font-bold text-xl text-center">
        Total revenue for every day in the past 7 day
      </h1>
      <ResponsiveContainer width="100%" height={500}>
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis dataKey="total" unit={"$"} />
          <Tooltip formatter={(value: number | string) => `$${Number(value).toFixed(2)}`} />
          <Bar dataKey="total" fill="#18C964" maxBarSize={120} radius={5} />
        </BarChart>
      </ResponsiveContainer>
    </>
  );
};

export default Last7DaySalesChart;

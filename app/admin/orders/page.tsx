import TableSkeleton from "@/components/UI/TableSkeleton";
import AdminOrders from "@/components/admin/orders/AdminOrders";
import { authOptions } from "@/utils/authOptions";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import React, { Suspense } from "react";

export const metadata: Metadata = {
  title: "EcoAlt | Admin Orders",
};

const page = async () => {
  const session = await getServerSession(authOptions);
  if (!session) {
    notFound();
  }

  return (
    <main className="container max-w-7xl mx-auto mt-16 p-3 flex flex-col gap-10">
      <Suspense
        fallback={
          <TableSkeleton
            head={[
              "Client Name",
              "Date",
              "Delivery Status",
              "Items Count",
              "Total Price",
              "Options",
            ]}
            rows={3}
          />
        }
      >
        <AdminOrders />
      </Suspense>
    </main>
  );
};

export default page;

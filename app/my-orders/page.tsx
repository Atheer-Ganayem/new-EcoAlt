import TableSkeleton from "@/components/UI/TableSkeleton";
import Orders from "@/components/admin/orders/Orders";
import { authOptions } from "@/utils/authOptions";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import React, { Suspense } from "react";

export const metadata: Metadata = {
  title: "EcoAlt | My orders",
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
        <Orders userId={session.user.id} />
      </Suspense>
    </main>
  );
};

export default page;

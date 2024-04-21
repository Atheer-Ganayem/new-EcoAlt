import TableSkeleton from "@/components/UI/TableSkeleton";
import AddProductDialog from "@/components/admin/products/add-product/Dialog";
import Products from "@/components/admin/products/table/Products";
import User from "@/models/User";
import { UserDoc } from "@/types/mongoModels";
import { authOptions } from "@/utils/authOptions";
import { connectDB } from "@/utils/connectDB";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React, { Suspense } from "react";

export const metadata: Metadata = {
  title: "EcoAlt | Admin Products",
};

const page = async () => {
  const session = await getServerSession(authOptions);
  if (!session || !session.user.isAdmin) {
    redirect("/");
  }

  await connectDB();
  const user = (await User.findById(session.user.id).select("isAdmin")) as UserDoc;
  if (!user.isAdmin) {
    redirect("/");
  }

  return (
    <main className="container max-w-7xl mx-auto mt-16 p-3 flex flex-col gap-10">
      <AddProductDialog mode="add" />
      <Suspense
        fallback={
          <TableSkeleton
            head={["Title", "Price", "Shipping Price", "Quantity", "Options"]}
            rows={3}
          />
        }
      >
        <Products />
      </Suspense>
    </main>
  );
};

export default page;

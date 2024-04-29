import Product from "@/models/Product";
import { connectDB } from "@/utils/connectDB";
import React from "react";
import ProductCard from "../home/ProductCard";
import Link from "next/link";

const SeachResults = async ({ searchKey }: { searchKey: string }) => {
  await connectDB();

  const products = await Product.find({
    $or: [
      { title: { $regex: searchKey, $options: "i" } },
      { description: { $regex: searchKey, $options: "i" } },
    ],
  });

  return products.length === 0 && searchKey ? (
    <p className="text-center text-xl">
      No results found for {`"${searchKey}"`}. Explore all{" "}
      <Link href={"/"} className="underline font-bold text-primary-500">
        products
      </Link>
    </p>
  ) : (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map(product => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};

export default SeachResults;

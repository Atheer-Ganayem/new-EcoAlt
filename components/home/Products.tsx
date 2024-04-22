import React from "react";
import Product from "@/models/Product";
import ProductCard from "./ProductCard";
import { ProductDoc } from "@/types/mongoModels";
import { connectDB } from "@/utils/connectDB";

interface Props {
  page: number;
}

const Products: React.FC<Props> = async ({ page }) => {
  await connectDB();

  let products = (await Product.find(
    { isDeleted: false },
    { title: 1, price: 1, rating: 1, images: { $slice: 1 } }
  )
    .skip((page - 1) * 6)
    .limit(6)
    .lean()) as ProductDoc[];

  products = products.map(product => ({ ...product, _id: product._id.toString() })) as ProductDoc[];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map(product => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};

export default Products;

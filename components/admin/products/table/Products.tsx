import React from "react";
import Product from "@/models/Product";
import { ProductDoc } from "@/types/mongoModels";
import ProductTable from "./ProductTable";

const Products = async () => {
  let products = (await Product.find().select("-reviews -rating").lean()) as ProductDoc[];
  products = products.map(prod => ({ ...prod, _id: prod._id.toString() })) as ProductDoc[];

  return <ProductTable products={products} />;
};

export default Products;

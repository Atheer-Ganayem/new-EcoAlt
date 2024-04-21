"use client";

import { ProductDoc } from "@/types/mongoModels";
import React from "react";
import StarRating from "../UI/Rating";
import { Chip, Divider } from "@nextui-org/react";
import AddToCartBtn from "../UI/AddToCartBtn";

interface Props {
  product: ProductDoc;
}

const Detailts: React.FC<Props> = ({ product }) => {
  const inStock = product.qty > 0 ? true : false;

  return (
    <div className="flex flex-col gap-5">
      <h3 className="text-3xl font-bold">{product.title}</h3>
      <StarRating rating={product.rating} />
      <p className="text-3xl font-bold">
        ${product.price}{" "}
        <span className="text-2xl font-normal">+ ${product.shippingPrice} for shipping</span>
      </p>
      <p>
        <Chip variant="flat" color={inStock ? "success" : "danger"} size="lg">
          {inStock ? "In stock" : "Out of stock"}
        </Chip>
      </p>
      <Divider />
      <AddToCartBtn maxQty={product.qty} showAlert />
      <Divider />
      <h1 className="text-center font-bold text-xl">Product description</h1>
      <p>{product.description}</p>
    </div>
  );
};

export default Detailts;

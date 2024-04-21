"use client";

import { ProductDoc } from "@/types/mongoModels";
import { Button, Card, CardBody, CardFooter, CardHeader } from "@nextui-org/react";
import { Eye } from "lucide-react";
import Link from "next/link";
import React from "react";
import StarRating from "../UI/Rating";

interface Props {
  product: ProductDoc;
}

const ProductCard: React.FC<Props> = ({ product }) => {
  return (
    <Card>
      <CardBody className="p-0 bg-white">
        <Link
          href={`/products/${product._id}`}
          style={{ maxHeight: "384px", width: "auto", overflow: "hidden" }}
        >
          <img
            className="h-64 mx-auto"
            src={process.env.AWS + product.images[0]}
            alt="product image"
          />
        </Link>
      </CardBody>
      <CardFooter className="p-5 flex-col items-start">
        <h4 className="font-bold text-medium">
          <Link className=" hover:underline duration-200" href={`/products/${product._id}`}>
            {product.title}
          </Link>
        </h4>
        <div className="my-3">
          <StarRating rating={product.rating} />
        </div>
        <p className="flex flex-row justify-between items-center w-full">
          <span className="text-2xl font-bold">${product.price}</span>
          <Button
            color="success"
            className="text-white"
            as={Link}
            href={`/products/${product._id}`}
          >
            Details <Eye />
          </Button>
        </p>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;

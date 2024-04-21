"use client";

import { ProductDoc } from "@/types/mongoModels";
import { Card, CardBody, CardHeader, Chip, Divider } from "@nextui-org/react";
import AddToCartBtn from "../UI/AddToCartBtn";
import StarRating from "../UI/Rating";

interface Props {
  product: ProductDoc;
}

const Summary: React.FC<Props> = ({ product }) => {
  const inStock = product.qty > 0 ? true : false;

  return (
    <Card className="min-w-full max-w-full w-full">
      <CardHeader className="flex justify-center bg-foreground-200">Summary</CardHeader>
      <CardBody className="flex flex-col gap-3">
        <p className="flex gap-3 items-center font-bold">
          Status:
          <Chip
            variant="flat"
            color={inStock ? (product.qty < 10 ? "warning" : "success") : "danger"}
            size="lg"
          >
            {inStock ? `${product.qty} In stock` : "Out of stock"}
          </Chip>
        </p>
        <Divider />
        <p className="flex gap-3 items-center">
          <StarRating rating={product.rating} />
        </p>
        <Divider />
        <p className="flex gap-3 items-center font-bold">Price: ${product.price}</p>
        <Divider />
        <p className="flex gap-3 items-center font-bold">
          Shipping Price: ${product.shippingPrice}
        </p>
        <Divider />
        <p className="flex gap-3 items-center font-bold">
          Total Price (price + shipping): ${(product.shippingPrice + product.price).toFixed(2)}
        </p>
        <Divider />
        <p className="flex gap-3 items-center justify-center">
          <AddToCartBtn maxQty={product.qty} showAlert={false} />
        </p>
      </CardBody>
    </Card>
  );
};

export default Summary;

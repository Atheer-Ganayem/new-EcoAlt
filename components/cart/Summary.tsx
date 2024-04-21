"use client";

import { Button, Card, CardBody, Divider } from "@nextui-org/react";
import { BaggageClaim, HandCoins, Package, ShoppingBasket } from "lucide-react";
import Link from "next/link";

interface Props {
  totalQty: number;
  totalProductsPrice: number;
  totalShippingPrice: number;
  totalPrice: number;
}

const Summary: React.FC<Props> = ({
  totalPrice,
  totalProductsPrice,
  totalQty,
  totalShippingPrice,
}) => {
  return (
    <Card className="w-fit  my-12 p-5">
      <CardBody className="flex flex-col gap-3">
        <p className="flex gap-3 items-center font-bold">
          <ShoppingBasket className="text-success" /> Total Products Price ({totalQty} items): $
          {totalProductsPrice.toFixed(2)}
        </p>
        <Divider />
        <p className="flex gap-3 items-center font-bold">
          <Package className="text-secondary" /> Total Shipping Price ({totalQty} items): $
          {totalShippingPrice.toFixed(2)}
        </p>
        <Divider />
        <p className="flex gap-3 items-center font-bold">
          <HandCoins className="text-warning" /> Total Price ({totalQty} items): $
          {totalPrice.toFixed(2)}
        </p>
        <Divider />
        <Button color="success" className="text-white" as={Link} href="/checkout">
          Checkout <BaggageClaim />
        </Button>
      </CardBody>
    </Card>
  );
};

export default Summary;

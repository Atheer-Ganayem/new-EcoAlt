"use client";

import { OrderItem, ProductDoc } from "@/types/mongoModels";
import { switchDeliveryStatus } from "@/utils/actions/order";
import { Button, Card, CardBody, Divider } from "@nextui-org/react";
import { CalendarCheck, CalendarX, HandCoins, Package, ShoppingBasket } from "lucide-react";
import { useSession } from "next-auth/react";

const PriceSummary = ({
  items,
  orderId,
  isDelivered,
}: {
  items: OrderItem[];
  orderId: string;
  isDelivered: boolean;
}) => {
  const { data: session } = useSession();

  const totalQty = items.reduce((prev, current) => prev + current.qty, 0);
  const totalProductsPrice = items.reduce(
    (prev, current) => prev + current.qty * (current.product as ProductDoc).price,
    0
  );
  const totalShippingPrice = items.reduce(
    (prev, current) => prev + current.qty * (current.product as ProductDoc).shippingPrice,
    0
  );

  return (
    <Card className="w-fit p-5 h-fit">
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
          {(totalProductsPrice + totalShippingPrice).toFixed(2)}
        </p>
        <Divider />
        <Button
          color={isDelivered ? "danger" : "success"}
          className="text-white"
          onClick={async () => {
            await switchDeliveryStatus(orderId);
          }}
        >
          {isDelivered ? (
            <span className="flex gap-3 items-center">
              Mark As Not Delivered <CalendarX />
            </span>
          ) : (
            <span className="flex gap-3 items-center">
              Mark As Delivered <CalendarCheck />
            </span>
          )}
        </Button>
      </CardBody>
    </Card>
  );
};

export default PriceSummary;

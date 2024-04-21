"use client";

import type { OrderDoc, ProductDoc } from "@/types/mongoModels";
import { Card, CardBody, CardHeader, Divider } from "@nextui-org/react";
import {
  Building2,
  Calendar,
  CalendarCheck,
  CalendarClock,
  Flag,
  HandCoins,
  Home,
  Package,
  Phone,
  ShoppingBasket,
} from "lucide-react";
import Image from "next/image";
import PriceSummary from "./PriceSummary";

interface Props {
  order: OrderDoc;
}

const Info: React.FC<Props> = ({ order }) => {
  return (
    <div className="flex gap-10 mb-10 ">
      <PriceSummary items={order.items} orderId={order._id.toString()} isDelivered={order.isDelivered} />
      <Card className="w-fit p-5">
        <CardBody className="flex flex-col gap-3">
          <p className="flex gap-3 items-center font-bold">
            <Calendar className="text-primary" /> Ordered At: {order.createdAt.toLocaleDateString()}
          </p>
          <Divider />
          <p className="flex gap-3 items-center font-bold">
            {!order.isDelivered ? (
              <CalendarClock className="text-danger" />
            ) : (
              <CalendarCheck className="text-success" />
            )}{" "}
            Delivery Status:{" "}
            {!order.isDelivered
              ? "Not delivered yet"
              : `Delivered at ${order.deliveredAt.toLocaleDateString()}`}
          </p>
          <Divider />
          <p className="flex gap-3 items-center font-bold">
            <Image src="/visa.png" width={30} height={30} alt="visa" /> Payment Method:{" "}
            {order.lastCreditCardDegits}
          </p>
          <Divider />
          <p className="flex gap-3 items-center font-bold">
            <Flag className="text-secondary" /> Country: {order.address.country}
          </p>
          <Divider />
          <p className="flex gap-3 items-center font-bold">
            <Building2 className="text-warning" /> City: {order.address.city}
          </p>
          <Divider />
          <p className="flex gap-3 items-center font-bold">
            <Home className="text-primary" /> Street: {order.address.street}
          </p>
          <Divider />
          <p className="flex gap-3 items-center font-bold">
            <Phone className="text-success" /> Phone Number: {order.address.phone}
          </p>
        </CardBody>
      </Card>
    </div>
  );
};

export default Info;

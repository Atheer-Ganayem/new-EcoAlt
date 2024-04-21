"use client";

import { OrderDoc, UserDoc } from "@/types/mongoModels";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  user,
  Chip,
} from "@nextui-org/react";
import { Eye } from "lucide-react";
import Link from "next/link";

interface Props {
  orders: OrderDoc[];
}

const OrdersTable: React.FC<Props> = ({ orders }) => {
  return (
    <Table isStriped aria-label="Example static collection table" selectionMode="single">
      <TableHeader>
        <TableColumn className="text-center">Client Name</TableColumn>
        <TableColumn className="text-center">Date</TableColumn>
        <TableColumn className="text-center">Delivery Status</TableColumn>
        <TableColumn className="text-center">Items Count</TableColumn>
        <TableColumn className="text-center">Total Price</TableColumn>
        <TableColumn className="text-center">Options</TableColumn>
      </TableHeader>
      <TableBody>
        {orders.map(order => (
          <TableRow key={order._id.toString()}>
            <TableCell className="text-center">
              <span className="text-center">{(order.user as UserDoc).name}</span>
            </TableCell>
            <TableCell className="text-center">
              <span>{order.createdAt.toLocaleDateString()}</span>
            </TableCell>
            <TableCell className="text-center">
              {!order.isDelivered ? (
                <Chip color="danger" variant="flat">
                  Not Delivered
                </Chip>
              ) : (
                <Chip color="success" variant="flat">
                  {order.deliveredAt.toLocaleDateString()}
                </Chip>
              )}
            </TableCell>
            <TableCell className="text-center">
              <span>{order.items.reduce((prev, current) => prev + current.qty, 0)} Items</span>
            </TableCell>
            <TableCell className="text-center">
              <span>
                $
                {order.items
                  .reduce(
                    (prev, current) => prev + current.qty * (current.price + current.shippingPrice),
                    0
                  )
                  .toFixed(2)}
              </span>
            </TableCell>
            <TableCell>
              <Link href={`/orders/${order._id}`} className="flex justify-center">
                <Eye className="cursor-pointer text-warning" />
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default OrdersTable;

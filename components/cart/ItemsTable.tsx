"use client";

import { CartItem, ProductDoc } from "@/types/mongoModels";
import { Card } from "@nextui-org/react";
import ItemCell from "./ItemCell";
import QuantityUpdate from "./QuantityUpdate";
import Link from "next/link";
import { Ban } from "lucide-react";

interface Props {
  cart: CartItem[];
  isCheckout?: boolean;
}

const ItemsTable: React.FC<Props> = ({ cart, isCheckout }) => {
  return (
    <>
      <Card className="p-5">
        <div className="hidden lg:grid grid-cols-12 text-center bg-foreground-100 p-3 text-foreground-600 text-sm rounded-xl">
          <span className="col-span-4">Item</span>
          <span className="col-span-3">Quantity</span>
          <span className="col-span-3">Price</span>
          <span className="col-span-2">Total</span>
        </div>
        {cart.length > 0 ? (
          cart.map(item => {
            const product = item.product as ProductDoc;
            return (
              <div
                key={item._id!.toString()}
                className="flex flex-col gap-4 lg:grid grid-cols-12 p-5"
              >
                <span className="flex lg:flex-row flex-col items-center lg:items-start gap-3 col-span-4">
                  <ItemCell
                    image={product.images[0]}
                    title={product.title}
                    rating={product.rating}
                    productId={product._id}
                  />
                </span>
                <span className="flex justify-center col-span-3">
                  {isCheckout ? (
                    <span className="font-bold text-lg">
                      {item.qty} {item.qty === 1 ? "Item" : "Items"}
                    </span>
                  ) : (
                    <QuantityUpdate
                      maxQty={product.qty}
                      productId={product._id}
                      currentQty={item.qty}
                    />
                  )}
                </span>
                <span className="text-lg font-bold  text-center col-span-3">
                  <p>
                    ${product.price} x {item.qty} = ${(product.price * item.qty).toFixed(2)}
                  </p>
                  <p>
                    Shipping fees: ${product.shippingPrice} x {item.qty} = $
                    {(product.shippingPrice * item.qty).toFixed(2)}
                  </p>
                </span>
                <span className="text-lg font-bold text-center col-span-2">
                  <p>
                    Total price: $
                    {(product.price * item.qty + product.shippingPrice * item.qty).toFixed(2)}
                  </p>
                </span>
              </div>
            );
          })
        ) : (
          <div className="flex justify-center items-center py-12 font-bold gap-3 text-2xl">
            <Ban size={50} />
            <span>
              Your cart is empty. Continue {""}
              <Link href="/" className="underline">
                shopping
              </Link>
            </span>
          </div>
        )}
      </Card>
    </>
  );
};

export default ItemsTable;

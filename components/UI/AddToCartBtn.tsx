"use client";

import { addToCart, buyNow } from "@/utils/actions/cart";
import { serverSideError } from "@/utils/http-helpers";
import { Button, Input } from "@nextui-org/react";
import { Minus, Plus, TriangleAlert } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
  maxQty: number;
  showAlert: boolean;
}

const AddToCartBtn: React.FC<Props> = ({ maxQty, showAlert }) => {
  const { data: session, status } = useSession();
  const [qty, setQty] = useState<number>(1);
  const [loading, setLoading] = useState<"" | "add-to-cart" | "buy-now">("");
  const [error, setError] = useState<string>("");
  const productId = useParams().productId as string;
  const router = useRouter();

  function increaseHandler() {
    if (qty < maxQty) {
      setQty(prev => prev + 1);
    }
  }

  function decreaseHandler() {
    if (qty > 1) {
      setQty(prev => prev - 1);
    }
  }

  async function addToCartHandler() {
    setLoading("add-to-cart");
    setError("");
    try {
      const result = await addToCart({ productId, qty });

      if (!result.error) {
        router.push("/cart");
      } else if (result.error) {
        setError(result.message);
      }
    } catch (error) {
      setError(serverSideError().message);
    } finally {
      setLoading("");
    }
  }

  async function buyNowHandler() {
    setLoading("buy-now");
    setError("");
    try {
      const result = await buyNow({ productId, qty });

      if (!result.error) {
        router.push("/checkout");
      } else if (result.error) {
        setError(result.message);
      }
    } catch (error) {
      setError(serverSideError().message);
    } finally {
      setLoading("");
    }
  }

  return (
    <div>
      <div className="flex flex-col w-fit">
        <div className="flex justify-center">
          <Button
            color="danger"
            variant="flat"
            className="rounded-e-none rounded-b-none"
            isDisabled={qty === 1 || !session}
            onClick={decreaseHandler}
          >
            <Minus />
          </Button>

          <Input
            type="number"
            labelPlacement={"outside-left"}
            style={{ textAlign: "center", borderRadius: "0" }}
            value={qty.toString()}
            min="0"
            max={maxQty}
            classNames={{ inputWrapper: ["rounded-none"] }}
          />

          <Button
            color="success"
            variant="flat"
            className="rounded-s-none rounded-b-none"
            isDisabled={qty === maxQty || !session}
            onClick={increaseHandler}
          >
            <Plus />
          </Button>
        </div>
        <div className="w-full flex">
          <Button
            className="rounded-t-none w-1/2 rounded-e-none"
            color="secondary"
            variant="flat"
            isDisabled={!session || maxQty === 0 || loading === "add-to-cart"}
            isLoading={loading === "buy-now"}
            onClick={buyNowHandler}
          >
            Buy Now
          </Button>
          <Button
            className="rounded-t-none w-1/2 rounded-s-none"
            color="primary"
            variant="flat"
            isDisabled={!session || maxQty === 0 || loading === "buy-now"}
            onClick={addToCartHandler}
            isLoading={loading === "add-to-cart"}
          >
            AddToCart
          </Button>
        </div>
      </div>
      {!session && showAlert && status !== "loading" && (
        <div className="p-3 bg-warning-500 border border-warning-50 rounded-xl mt-5 flex gap-3">
          <TriangleAlert /> You have to login first to buy this product or add it to your cart.
          <Link href="/auth" className="underline">
            Login here
          </Link>
        </div>
      )}
      {error && (
        <div className="p-3 bg-danger-500 text-white rounded-xl mt-5 flex gap-3">
          <TriangleAlert /> {error}
        </div>
      )}
    </div>
  );
};

export default AddToCartBtn;

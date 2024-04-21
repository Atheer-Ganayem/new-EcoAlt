import { addToCart, removeFromCart } from "@/utils/actions/cart";
import { serverSideError } from "@/utils/http-helpers";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/react";
import { AlertTriangle, Minus, Plus, Trash } from "lucide-react";
import React, { useState } from "react";
import ErrorAlert from "@/components/UI/ErrorAlert";

interface Props {
  productId: string;
  maxQty: number;
  currentQty: number;
}

const QuantityUpdate: React.FC<Props> = ({ maxQty, productId, currentQty }) => {
  const [qty, setQty] = useState<number>(currentQty);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

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
    setLoading(true);
    setError("");
    try {
      const result = await addToCart({ productId, qty });

      if (result.error) {
        setError(result.message);
      }
    } catch (error) {
      setError(serverSideError().message);
    } finally {
      setLoading(false);
    }
  }

  async function removeFromCartHandler() {
    setLoading(true);
    setError("");
    try {
      const result = await removeFromCart(productId);

      if (result.error) {
        setError(result.message);
      }
    } catch (error) {
      setError(serverSideError().message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col w-fit">
      <div className="flex justify-center">
        <Button
          color="danger"
          variant="flat"
          className={`rounded-e-none  ${qty !== currentQty ? "rounded-b-none" : undefined}`}
          isDisabled={qty === 1}
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
          className={`rounded-s-none  ${qty !== currentQty ? "rounded-b-none" : undefined}`}
          isDisabled={qty === maxQty}
          onClick={increaseHandler}
        >
          <Plus />
        </Button>
      </div>
      {qty !== currentQty && (
        <div className="w-full flex">
          <Button
            className="rounded-t-none w-full"
            color="primary"
            variant="flat"
            isDisabled={maxQty === 0 || loading}
            onClick={addToCartHandler}
            isLoading={loading}
          >
            Update Quantity
          </Button>
        </div>
      )}
      <Button
        color="danger"
        variant="ghost"
        className="mt-2"
        isLoading={loading}
        onClick={removeFromCartHandler}
      >
        Remove from cart <Trash />
      </Button>
      {error && (
        <div className="mt-4">
          <ErrorAlert text={error} />
        </div>
      )}
    </div>
  );
};

export default QuantityUpdate;

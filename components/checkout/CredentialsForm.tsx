"use client";

import { Card } from "@nextui-org/react";
import { AlertCircle, CreditCard, Package } from "lucide-react";
import AddressForm from "./AddressForm";
import PaymentForm from "./PaymentForm";
import SubmitBtn from "../UI/SubmitBtn";
import { useFormState } from "react-dom";
import { createOrder } from "@/utils/actions/order";
import { useRouter } from "next/navigation";

const CredentialsForm = () => {
  const [state, formAction] = useFormState(createOrder, {
    message: "",
    error: false,
    code: 200,
  });
  const router = useRouter();

  if (state.code === 201) {
    router.push(`/orders/${state.oderId}`);
  }

  return (
    <form action={formAction} className="my-12">
      <Card className="p-8 w-fit mx-auto">
        <h1 className="font-bold text-lg flex gap-3 justify-center mb-4">
          <Package className="text-warning" /> Shipping Address
        </h1>
        <AddressForm />
        <h1 className="font-bold text-lg flex gap-3 justify-center my-4">
          <CreditCard className="text-success" /> Payment Method
        </h1>
        <PaymentForm />
      </Card>
      <div className="flex justify-center mt-10 flex-col gap-5 items-center">
        {state.error && (
          <p className="rounded-xl bg-danger-500 w-96 p-4 flex flex-row gap-3 text-white">
            <AlertCircle /> {state.message}
          </p>
        )}
        <div className="w-96">
          <SubmitBtn text="Checkout" />
        </div>
      </div>
    </form>
  );
};

export default CredentialsForm;

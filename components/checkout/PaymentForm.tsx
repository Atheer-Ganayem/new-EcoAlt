import { Input, Select, SelectItem } from "@nextui-org/react";
import React, { useState } from "react";

const PaymentForm = () => {
  const [cardNumber, setCardnNumber] = useState<string>("");
  const [cvv, setCvv] = useState<string>("");
  const currentYear = new Date().getFullYear();

  function onChangeCardNumberHandler(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.value.length < cardNumber.length) {
      return setCardnNumber(e.target.value);
    }
    const digit = e.target.value.split("").pop() || "";
    if (
      !["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"].includes(digit) ||
      cardNumber.length === 19
    ) {
      return;
    }
    setCardnNumber(prev => {
      if (prev.length === 4 || prev.length === 9 || prev.length === 14) {
        return prev + "-" + digit;
      }
      return prev + digit;
    });
  }

  return (
    <div className="flex flex-col gap-5 items-center">
      <Input
        name="cardnumber"
        label="Card Number"
        placeholder="Enter your card number"
        variant="bordered"
        className="max-w-96"
        value={cardNumber}
        onChange={onChangeCardNumberHandler}
        endContent={
          <div className="flex gap-1 me-6">
            <img src="/visa.png" alt="visa" width={30} />
            <img src="/mastercard.png" alt="mastercard" width={30} />
            <img src="/ax.png" alt="american express" width={30} />
          </div>
        }
      />
      <Select
        name="expirationYear"
        label="Expiration Year"
        placeholder="Select a year"
        className="max-w-96"
      >
        {Array.from({ length: 6 }).map((num, index) => (
          <SelectItem key={currentYear + index} value={currentYear + index}>
            {(currentYear + index).toString()}
          </SelectItem>
        ))}
      </Select>
      <Select
        name="expirationMonth"
        label="Expiration Month"
        placeholder="Select a month"
        className="max-w-96"
      >
        {Array.from({ length: 12 }).map((num, index) => (
          <SelectItem key={index} value={index + 1}>
            {(index + 1).toString()}
          </SelectItem>
        ))}
      </Select>
      <Input
        name="cvv"
        label="CVV"
        placeholder="Enter the card CVV"
        variant="bordered"
        className="max-w-96"
        type="number"
        value={cvv}
        onChange={e => {
          if (e.target.value.length <= 3) {
            setCvv(e.target.value);
          }
        }}
      />
    </div>
  );
};

export default PaymentForm;

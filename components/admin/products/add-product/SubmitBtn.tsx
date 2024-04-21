import { Button } from "@nextui-org/button";
import React from "react";
import { useFormStatus } from "react-dom";

const SubmitBtn = ({ text }: { text: string }) => {
  const { pending } = useFormStatus();

  return (
    <Button color="success" type="submit" isLoading={pending}>
      {text}
    </Button>
  );
};

export default SubmitBtn;

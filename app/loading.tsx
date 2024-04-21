import { Spinner } from "@nextui-org/react";
import React from "react";

const loading = () => {
  return (
    <div className="flex justify-center h-[100vh] items-center">
      <Spinner size="lg" label="Loading..." color="success" labelColor="success" />
    </div>
  );
};

export default loading;

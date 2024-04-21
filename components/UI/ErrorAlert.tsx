"use client";

import { Card, CardBody } from "@nextui-org/react";
import { AlertTriangle } from "lucide-react";
import React from "react";

const Alert = ({ text }: { text: string }) => {
  return (
    <div className="border-danger border-3 rounded-lg">
      <Card>
        <CardBody className="bg-danger-50 text-current flex gap-3 flex-row">
          <AlertTriangle />
          {text}
        </CardBody>
      </Card>
    </div>
  );
};

export default Alert;

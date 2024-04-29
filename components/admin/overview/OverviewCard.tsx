"use client";

import { Card, CardHeader, CardBody } from "@nextui-org/react";

interface Props {
  title: string;
  icon: React.ReactNode;
  data: string | number;
  footerText?: string;
}

const OverviewCard: React.FC<Props> = props => {
  return (
    <Card className="p-4 w-full">
      <CardHeader className="flex justify-between">
        {props.title} {props.icon}
      </CardHeader>
      <CardBody className="overflow-visible font-bold text-xl ">{props.data}</CardBody>
    </Card>
  );
};

export default OverviewCard;

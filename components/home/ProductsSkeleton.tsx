"use client";

import { Card, CardBody, CardFooter, Skeleton } from "@nextui-org/react";

const ProductsSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: 9 }).map((num, index) => (
        <Card key={index + "card-skeleton"}>
          <CardBody className="p-0 bg-white">
            <Skeleton className="rounded-lg">
              <div className="h-96 rounded-lg bg-default-300"></div>
            </Skeleton>
          </CardBody>
          <CardFooter className="p-5 flex-col items-start">
            <Skeleton className="w-full rounded-lg">
              <div className="h-3 w-2/5 rounded-lg bg-default-300"></div>
            </Skeleton>
            <Skeleton className="w-2/5 rounded-lg my-3">
              <div className="h-3 w-2/5 rounded-lg bg-default-300"></div>
            </Skeleton>
            <Skeleton className="w-2/5 rounded-lg my-3">
              <div className="h-3 w-2/5 rounded-lg bg-default-300"></div>
            </Skeleton>
            <p className="flex flex-row justify-between items-center w-full mt-5">
              <Skeleton className="w-2/5 rounded-lg">
                <div className="h-3 w-2/5 rounded-lg bg-default-300"></div>
              </Skeleton>
              <Skeleton className="w-2/5 rounded-lg">
                <div className="h-3 w-2/5 rounded-lg bg-default-300"></div>
              </Skeleton>
            </p>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default ProductsSkeleton;

"use client";

import {
  Spinner,
  TableBody,
  TableColumn,
  TableHeader,
  Table,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import React from "react";

const loading = () => {
  return (
    <main className="container mx-auto mt-16 px-5">
      <Table
        classNames={{
          table: "min-h-[400px]",
          td: "text-center",
        }}
      >
        <TableHeader>
          <TableColumn key="name" allowsSorting>
            Title
          </TableColumn>
          <TableColumn key="height" allowsSorting>
            Quantity
          </TableColumn>
          <TableColumn key="mass" allowsSorting>
            Price
          </TableColumn>
          <TableColumn key="birth_year" allowsSorting>
            Total
          </TableColumn>
        </TableHeader>
        <TableBody
          isLoading
          loadingContent={<Spinner label="Fetching cart items, please wait..." color="success" />}
        >
          <TableRow>
            <TableCell className="text-transparent">.</TableCell>
            <TableCell className="text-transparent">.</TableCell>
            <TableCell className="text-transparent">.</TableCell>
            <TableCell className="text-transparent">.</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </main>
  );
};

export default loading;

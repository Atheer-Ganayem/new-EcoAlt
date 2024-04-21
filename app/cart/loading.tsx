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
        }}
      >
        <TableHeader>
          <TableColumn key="name" allowsSorting>
            Name
          </TableColumn>
          <TableColumn key="height" allowsSorting>
            Height
          </TableColumn>
          <TableColumn key="mass" allowsSorting>
            Mass
          </TableColumn>
          <TableColumn key="birth_year" allowsSorting>
            Birth year
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

"use client";

import {
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import React from "react";

interface Props {
  head: string[];
  rows: number;
}

const TableSkeleton: React.FC<Props> = ({ head, rows }) => {
  return (
    <Table aria-label="Example static collection table" selectionMode="single">
      <TableHeader>
        {head.map(h => (
          <TableColumn className="text-center" key={h}>
            {h}
          </TableColumn>
        ))}
      </TableHeader>
      <TableBody className="gap-0 p-0">
        {Array.from({ length: rows }).map((num, index) => (
          <TableRow key={index}>
            {Array.from({ length: head.length }).map((_, colIndex) => (
              <TableCell className={`text-center`} key={"col" + colIndex}>
                <Skeleton className="rounded-lg">
                  <div className="h-6 rounded-lg bg-default-300"></div>
                </Skeleton>
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TableSkeleton;

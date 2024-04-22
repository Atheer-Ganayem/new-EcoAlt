"use client";

import { Pagination } from "@nextui-org/react";
import { redirect, useRouter } from "next/navigation";
import React from "react";

interface Props {
  total: number;
  current: number;
}

const HomePagintation: React.FC<Props> = ({ current, total }) => {
  const router = useRouter();

  function changeHandler(pageNum: number) {
    console.log(pageNum);
    router.push("/?page=" + pageNum);
  }

  return (
    <div className="flex justify-center mt-10">
      <Pagination total={total} initialPage={current} color="success" onChange={changeHandler} />
    </div>
  );
};

export default HomePagintation;

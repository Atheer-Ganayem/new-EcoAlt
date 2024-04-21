"use client";

import { Button } from "@nextui-org/button";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const error = () => {
  return (
    <main className="flex flex-col items-center gap-10 mt-32">
      <p className="font-bold text-3xl">An error occurred!</p>
      <Image src="/error.svg" width={300} height={300} alt="not-found.svg" />
      <Button as={Link} href="/" color="success">
        Home Page
      </Button>
    </main>
  );
};

export default error;

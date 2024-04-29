import Cards from "@/components/admin/overview/Cards";
import Charts from "@/components/admin/overview/Charts";
import React from "react";

const page = async () => {
  return (
    <main className="container max-w-7xl mx-auto mt-16 p-3 flex flex-col gap-10">
      <Cards />
      <Charts />
    </main>
  );
};

export default page;

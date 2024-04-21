import Products from "@/components/home/Products";
import ProductsSkeleton from "@/components/home/ProductsSkeleton";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "EcoAlt | Home",
};

export default function Home() {
  return (
    <main className="container mx-auto max-w-7xl mt-16 p-5">
      <Suspense fallback={<ProductsSkeleton />}>
        <Products />
      </Suspense>
    </main>
  );
}

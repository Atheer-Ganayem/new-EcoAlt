import Products from "@/components/home/Products";
import ProductsSkeleton from "@/components/home/ProductsSkeleton";
import { Metadata } from "next";
import { Suspense } from "react";
import Product from "@/models/Product";
import HomePagintation from "@/components/home/HomePagintation";
import { connectDB } from "@/utils/connectDB";
import SearchBar from "@/components/search/SearchBar";

interface Props {
  searchParams: { page: string };
}

export const metadata: Metadata = {
  title: "EcoAlt | Home",
};

export default async function Home({ searchParams }: Props) {
  let page = isNaN(parseInt(searchParams.page)) ? 1 : parseInt(searchParams.page);
  if (page <= 0) {
    page = 1;
  }

  await connectDB();

  const totalPages = Math.ceil((await Product.countDocuments()) / 6);

  return (
    <main className="container mx-auto max-w-7xl mt-8 p-5">
      <div className="mb-12">
        <SearchBar currentKey="" />
      </div>
      <Suspense fallback={<ProductsSkeleton />}>
        <Products page={page} />
        <HomePagintation current={page} total={totalPages} />
      </Suspense>
    </main>
  );
}

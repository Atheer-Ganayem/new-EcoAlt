import ProductsSkeleton from "@/components/home/ProductsSkeleton";
import SearchBar from "@/components/search/SearchBar";
import SeachResults from "@/components/search/SearchResults";
import React, { Suspense } from "react";

interface Props {
  searchParams: { key: string };
}

const page: React.FC<Props> = ({ searchParams }) => {
  return (
    <main className="container mx-auto max-w-7xl mt-8 p-5">
      <SearchBar currentKey={searchParams.key} />
      {searchParams.key && (
        <div className="mt-12">
          <Suspense fallback={<ProductsSkeleton />}>
            <SeachResults searchKey={searchParams.key} />
          </Suspense>
        </div>
      )}
    </main>
  );
};

export default page;

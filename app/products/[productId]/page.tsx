import React from "react";
import Product from "@/models/Product";
import { ProductDoc, ReviewDoc } from "@/types/mongoModels";
import Images from "@/components/product-page/Images";
import Detailts from "@/components/product-page/Detailts";
import Summary from "@/components/product-page/Summary";
import { connectDB } from "@/utils/connectDB";
import ReviewsSection from "@/components/product-page/ReviewsSection";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: { productId: string } }) {
  try {
    await connectDB();

    const product = (await Product.findById(params.productId).select("title").lean()) as ProductDoc;
    if (!product) {
      return {
        title: "EcoAlt | Not found",
      };
    }

    return {
      title: "EcoAlt | " + product.title,
    };
  } catch (error) {
    return {
      title: "EcoAlt",
    };
  }
}

const page = async ({ params }: { params: { productId: string } }) => {
  await connectDB();

  const product = (await Product.findOne({ _id: params.productId, isDeleted: false })
    .populate({
      path: "reviews",
      select: "user rating comment",
      populate: { path: "user", select: "name avatar" },
    })
    .lean()) as ProductDoc;

  if (!product) {
    notFound();
  }

  product._id = product._id.toString();

  return (
    <main className="container mx-auto mt-16 px-5">
      <div className="grid grid-cols1 lg:grid-cols-12 gap-10 mx-auto justify-items-center lg:justify-items-start">
        <div className="mx-auto lg:col-span-3">
          <Images images={product.images} />
        </div>
        <div className="lg:col-span-6">
          <Detailts product={product} />
        </div>
        <div className="lg:col-span-3 w-full">
          <Summary product={product} />
        </div>
      </div>
      <ReviewsSection productId={params.productId} reviews={product.reviews as ReviewDoc[]} />
    </main>
  );
};

export default page;

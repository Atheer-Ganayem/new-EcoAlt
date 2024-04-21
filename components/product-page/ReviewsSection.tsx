import React from "react";
import ReviewForm from "./ReviewForm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import Order from "@/models/Order";
import { ReviewDoc } from "@/types/mongoModels";
import Reviews from "./Reviews";

interface Props {
  productId: string;
  reviews: ReviewDoc[];
}

const ReviewsSection: React.FC<Props> = async ({ productId, reviews }) => {
  const session = await getServerSession(authOptions);

  let isBought = false;
  if (session) {
    isBought = !!(await Order.findOne({ user: session?.user.id, "items.product": productId }));
  }

  return (
    <section className="my-10 lg:grid lg:grid-cols-12 gap-10">
      <div className="lg:col-span-3">{isBought && <ReviewForm />}</div>
      <div className="lg:col-span-6">
        <h1 className="font-bold text-2xl mb-8">Reviews ({reviews.length}):</h1>
        <Reviews reviews={reviews} />
      </div>
    </section>
  );
};

export default ReviewsSection;

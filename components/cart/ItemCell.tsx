"use client";

import Link from "next/link";
import StarRating from "../UI/Rating";

interface Props {
  image: string;
  title: string;
  rating: number;
  productId: string;
}

const ItemCell: React.FC<Props> = ({ image, rating, title, productId }) => {
  return (
    <>
      <img src={process.env.AWS + image} alt="product image" className="lg:h-20 w-32 lg:w-auto" />
      <div>
        <h3 className="text-lg font-bold">
          <Link href={`/products/${productId}`} className="hover:underline">
            {title.length > 45 ? title.substring(0, 45) + "..." : title}
          </Link>
        </h3>
        <div className="flex justify-center lg:justify-start">
          <StarRating rating={rating} />
        </div>
      </div>
    </>
  );
};

export default ItemCell;

"use client";

import React from "react";
import { Star, StarHalf } from "lucide-react";
import { Chip } from "@nextui-org/react";

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex">
      {[...Array(5)].map((_, index) => {
        const ratingValue = index + 1;

        return (
          <span key={index}>
            {ratingValue <= rating ? (
              <Star size={24} color="#ffc107" />
            ) : ratingValue - 0.5 <= rating ? (
              <StarHalf size={24} color="#ffc107" />
            ) : (
              <Star size={24} color="#e4e5e9" />
            )}
          </span>
        );
      })}
      <Chip color="warning" variant="flat" className="ms-1 rounded-small">
        {rating}
      </Chip>
    </div>
  );
};

export default StarRating;

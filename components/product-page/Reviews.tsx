"use client";

import { ReviewDoc, UserDoc } from "@/types/mongoModels";
import { Card, User } from "@nextui-org/react";
import StarRating from "../UI/Rating";

const Comments = ({ reviews }: { reviews: ReviewDoc[] }) => {
  return (
    <div className="flex flex-col gap-8">
      {reviews.map(review => (
        <Card key={review._id.toString()} className="flex items-start p-5">
          <User
            name={(review.user as UserDoc).name}
            avatarProps={{
              src: process.env.AWS + (review.user as UserDoc).avatar,
            }}
            classNames={{ name: ["text-xl"] }}
          />
          <p>
            <StarRating rating={review.rating} />
          </p>
          <p>{review.comment}</p>
        </Card>
      ))}
    </div>
  );
};

export default Comments;

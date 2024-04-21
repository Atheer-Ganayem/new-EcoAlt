import { Schema, model, models } from "mongoose";

const objectId = Schema.Types.ObjectId;

const reviewSchema = new Schema(
  {
    user: { type: objectId, ref: "User", required: true },
    product: { type: objectId, ref: "Product", required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const Review = models.Review || model("Review", reviewSchema);
export default Review;

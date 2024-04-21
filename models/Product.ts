import { Schema, model, models } from "mongoose";
require("@/models/Review");

const objectId = Schema.Types.ObjectId;

const productSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  qty: { type: Number, required: true },
  price: { type: Number, required: true },
  shippingPrice: { type: Number, required: true },
  images: [{ type: String, required: true }],
  rating: { type: Number, default: 0 },
  reviews: [{ type: objectId, ref: "Review" }],
  isDeleted: { type: Boolean, required: true, default: false },
});

const User = models.Product || model("Product", productSchema);
export default User;

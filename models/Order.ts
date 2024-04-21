import { Schema, model, models } from "mongoose";

const objectId = Schema.Types.ObjectId;

const orderSchema = new Schema(
  {
    user: { type: objectId, ref: "User" },
    items: [
      {
        product: { type: objectId, ref: "Product" },
        qty: { type: Number },
        price: { type: Number },
        shippingPrice: { type: Number },
      },
    ],
    lastCreditCardDegits: { type: String, required: true },
    isDelivered: { type: Boolean, default: false },
    deliveredAt: { type: Date },
    address: {
      country: { type: String, required: true },
      city: { type: String, required: true },
      street: { type: String, required: true },
      phone: { type: String, required: true },
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const Order = models.Order || model("Order", orderSchema);
export default Order;

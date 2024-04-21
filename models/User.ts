import { Schema, model, models } from "mongoose";

const objectId = Schema.Types.ObjectId;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false, required: true },
  avatar: { type: String, required: true },
  cart: [
    {
      product: { type: objectId, ref: "Product" },
      qty: { type: Number },
    },
  ],
});

const User = models.User || model("User", userSchema);
export default User;

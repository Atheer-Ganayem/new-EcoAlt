import { Document, Types } from "mongoose";

interface UserDoc extends Document {
  name: string;
  email: string;
  password: string;
  isAdmin: boolean;
  cart: CartItem[];
  avatar: string;
}

interface CartItem {
  product: Types.ObjectId | ProductDoc;
  qty: number;
  _id?: Types.ObjectId | string;
}

interface ProductDoc extends Document {
  title: string;
  description: string;
  qty: number;
  price: number;
  shippingPrice: number;
  images: string[];
  rating: number;
  reviews: Types.ObjectId[] | ReviewDoc[];
  isDeleted: boolean;
}

interface ReviewDoc extends Document {
  user: Types.ObjectId | UserDoc;
  product: Types.ObjectId | ProductDoc;
  rating: number;
  comment: string;
  createdAt: Date;
}

interface OrderDoc extends Document {
  user: Types.ObjectId | UserDoc;
  items: OrderItem[];
  lastCreditCardDegits: string;
  isDelivered: boolean;
  deliveredAt: Date;
  address: OrderAdress;
  createdAt: Date;
}

interface OrderItem {
  _id: string;
  product: Types.ObjectId | ProductDoc;
  qty: number;
  price: number;
  shippingPrice: number;
}

interface OrderAdress {
  country: string;
  city: string;
  street: string;
  phone: string;
}

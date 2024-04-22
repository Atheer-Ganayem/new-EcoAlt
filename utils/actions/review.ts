"use server";

import { getServerSession } from "next-auth";
import {
  Res,
  invalidClientInputs,
  notAuthorized,
  notFound,
  serverSideError,
} from "../http-helpers";
import { authOptions } from "../authOptions";
import User from "@/models/User";
import Product from "@/models/Product";
import { connectDB } from "../connectDB";
import { ProductDoc, ReviewDoc, UserDoc } from "@/types/mongoModels";
import { revalidatePath } from "next/cache";
import Review from "@/models/Review";
import Order from "@/models/Order";

interface Data {
  productId: string;
  rating: number;
  comment: string;
}

export const submitReview: (prev: any, formData: FormData) => Promise<Res> = async (
  _,
  formData
) => {
  try {
    const rating = parseInt(formData.get("rating") as string);
    const comment = formData.get("comment") as string;
    const productId = formData.get("productId") as string;
    const data: Data = { rating, productId, comment };

    if (!data.comment || isNaN(data.rating) || data.rating < 1 || data.rating > 5) {
      return invalidClientInputs();
    }
    data.rating = Math.floor(data.rating);

    const session = await getServerSession(authOptions);
    if (!session) {
      return notAuthorized();
    }

    await connectDB();
    const currentUser = (await User.findById(session.user.id).select("cart")) as UserDoc;
    const product = (await Product.findById(data.productId).select(
      "qty reviews rating"
    )) as ProductDoc;

    if (!currentUser || !product) {
      return notFound();
    }
    const existingReview = await Review.findOne({ user: currentUser._id, product: product._id });
    if (existingReview) {
      return { error: true, message: "You can review this product only once.", code: 401 };
    }

    const isBought = !!(await Order.findOne({
      user: session?.user.id,
      "items.product": data.productId,
    }));

    if (!isBought) {
      return notAuthorized();
    }

    const review = (await Review.create({
      user: currentUser._id,
      product: product._id,
      rating: data.rating,
      comment: data.comment,
    })) as ReviewDoc;

    product.rating =
      (product.rating * product.reviews.length + data.rating) / (product.reviews.length + 1);

    product.reviews.push(review._id);

    await product.save();

    revalidatePath(`/products/${product._id}`);
    revalidatePath("/");

    return {
      error: false,
      message: "Review submitted successfully",
      code: 201,
    };
  } catch (error) {
    // console.log(error);

    return serverSideError();
  }
};

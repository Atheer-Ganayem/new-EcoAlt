"use server";

import { getServerSession } from "next-auth";
import { Res, notAuthorized, notFound, serverSideError } from "../http-helpers";
import { authOptions } from "../authOptions";
import User from "@/models/User";
import Product from "@/models/Product";
import { connectDB } from "../connectDB";
import { ProductDoc, UserDoc } from "@/types/mongoModels";
import { revalidatePath } from "next/cache";

interface Data {
  productId: string;
  qty: number;
}

export const addToCart: (data: Data) => Promise<Res> = async data => {
  try {
    if (data.qty < 0) {
      return { error: true, message: "Quantity must be greater than 0.", code: 422 };
    }

    const session = await getServerSession(authOptions);
    if (!session) {
      return notAuthorized();
    }

    await connectDB();
    const currentUser = (await User.findById(session.user.id).select("cart")) as UserDoc;
    const product = (await Product.findOne({ _id: data.productId, isDeleted: false }).select(
      "qty"
    )) as ProductDoc;
    if (!currentUser || !product) {
      return notFound();
    }

    if (data.qty > product.qty) {
      return {
        error: true,
        message: "The requested quantity is more than what we have in stock.",
        code: 422,
      };
    }

    const existingCartItemIndex = currentUser.cart.findIndex(
      item => item.product.toString() === data.productId
    );

    if (existingCartItemIndex === -1) {
      currentUser.cart.push({ product: product._id, qty: data.qty });
    } else {
      currentUser.cart[existingCartItemIndex].qty = data.qty;
    }

    await currentUser.save();

    revalidatePath("/cart");

    return {
      error: false,
      message: "Product added to cart successfully",
      code: 201,
    };
  } catch (error) {
    return serverSideError();
  }
};

export const buyNow: (data: Data) => Promise<Res> = async data => {
  try {
    if (data.qty < 0) {
      return { error: true, message: "Quantity must be greater than 0.", code: 422 };
    }

    const session = await getServerSession(authOptions);
    if (!session) {
      return notAuthorized();
    }

    await connectDB();
    const currentUser = (await User.findById(session.user.id).select("cart")) as UserDoc;
    const product = (await Product.findOne({ _id: data.productId, isDeleted: false }).select(
      "qty"
    )) as ProductDoc;
    if (!currentUser || !product) {
      return notFound();
    }

    if (data.qty > product.qty) {
      return {
        error: true,
        message: "The requested quantity is more than what we have in stock.",
        code: 422,
      };
    }

    currentUser.cart = [{ product: product._id, qty: data.qty }];

    await currentUser.save();

    revalidatePath("/checkout");
    revalidatePath("/cart");

    return {
      error: false,
      message: "Product added to cart successfully",
      code: 201,
    };
  } catch (error) {
    return serverSideError();
  }
};

export const removeFromCart: (productId: string) => Promise<Res> = async productId => {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return notAuthorized();
    }

    await connectDB();
    const currentUser = (await User.findById(session.user.id).select("cart")) as UserDoc;
    if (!currentUser) {
      return notFound();
    }

    currentUser.cart = currentUser.cart.filter(item => item.product.toString() !== productId);

    await currentUser.save();

    revalidatePath("/cart");

    return {
      error: false,
      message: "Product added to cart successfully",
      code: 201,
    };
  } catch (error) {
    return serverSideError();
  }
};

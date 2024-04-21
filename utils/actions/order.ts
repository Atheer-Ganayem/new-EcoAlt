"use server";

import { getServerSession } from "next-auth";
import { Res, notAuthorized, notFound, serverSideError } from "../http-helpers";
import { authOptions } from "../authOptions";
import User from "@/models/User";
import Product from "@/models/Product";
import { connectDB } from "../connectDB";
import { CartItem, OrderDoc, ProductDoc, UserDoc } from "@/types/mongoModels";
import { revalidatePath } from "next/cache";
import { countryList } from "../conutries";
import Order from "@/models/Order";

interface OrderRes extends Res {
  oderId?: string;
}

export const createOrder: (prev: any, formData: FormData) => Promise<OrderRes> = async (
  _,
  formData
) => {
  try {
    const data = extactData(formData);
    const validationMessage = validate(data);
    if (validationMessage) {
      return { error: true, message: validationMessage, code: 422 };
    }

    const session = await getServerSession(authOptions);
    if (!session) {
      return notAuthorized();
    }

    await connectDB();
    const currentUser = (await User.findById(session.user.id)
      .select("cart")
      .populate({
        path: "cart",
        populate: { path: "product", select: "title price qty shippingPrice" },
      })) as UserDoc;
    if (!currentUser) {
      return notFound();
    }

    const availabilityMessage = await checkProductAvailability(currentUser.cart);
    if (availabilityMessage) {
      return { error: true, message: availabilityMessage, code: 422 };
    }

    const order = await Order.create({
      user: currentUser._id,
      items: currentUser.cart.map(item => ({
        product: item.product._id,
        qty: item.qty,
        price: (item.product as ProductDoc).price,
        shippingPrice: (item.product as ProductDoc).shippingPrice,
      })),
      lastCreditCardDegits: data.cardnumber.slice(data.cardnumber.length - 4),
      address: {
        country: data.country,
        city: data.city,
        street: data.street,
        phone: data.phone,
      },
    });

    for (let index = 0; index < currentUser.cart.length; index++) {
      const item = currentUser.cart[index];
      await Product.updateOne({ _id: item.product._id }, { $inc: { qty: -item.qty } });
    }

    currentUser.cart = [];
    await currentUser.save();

    return {
      error: false,
      message: "Order created successfully",
      code: 201,
      oderId: order._id,
    };
  } catch (error) {
    return serverSideError();
  }
};

export const switchDeliveryStatus: (orderId: string) => Promise<OrderRes> = async orderId => {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return notAuthorized();
    }

    await connectDB();
    const currentUser = (await User.findById(session.user.id).select("isAdmin")) as UserDoc;
    const order = (await Order.findById(orderId).select("isDelivered deliveredAt")) as OrderDoc;
    if (!currentUser || !order) {
      return notFound();
    } else if (!currentUser.isAdmin) {
      return notAuthorized();
    }

    if (order.isDelivered) {
      order.isDelivered = false;
    } else {
      order.isDelivered = true;
      order.deliveredAt = new Date();
    }

    await order.save();

    revalidatePath("/my-orders");
    revalidatePath("/admin/orders");
    revalidatePath(`/orders/${orderId}`);

    return {
      error: false,
      message: "Order created successfully",
      code: 201,
    };
  } catch (error) {
    return serverSideError();
  }
};

async function checkProductAvailability(cart: CartItem[]) {
  const products = cart.map(item => item.product) as ProductDoc[];
  let result = "";

  for (let index = 0; index < products.length; index++) {
    const product = products[index];
    if (product.qty < cart[index].qty) {
      result += `You requested ${cart[index].qty} products of "${product.title}" but we only have ${product.qty} in stock, `;
    }
  }

  return result;
}

function validate({
  cardnumber,
  city,
  country,
  cvv,
  expirationMonth,
  expirationYear,
  phone,
  street,
}: Data): string {
  if (!countryList.includes(country)) {
    return "Invalid country name.";
  } else if (!city.trim()) {
    return "City is required, please enter your city name.";
  } else if (!street.trim()) {
    return "Street is required, please enter your street name.";
  } else if (!phone.trim()) {
    return "Phone number is required, please enter your phone number.";
  } else if (cardnumber.trim().length !== 19) {
    return "Please enter a valid credit card number.";
  } else if (
    isNaN(parseInt(expirationMonth)) ||
    parseInt(expirationMonth) > 12 ||
    parseInt(expirationMonth) < 1
  ) {
    return "Please enter a valid expiration month.";
  } else if (
    isNaN(parseInt(expirationYear)) ||
    parseInt(expirationYear) < new Date().getFullYear() ||
    parseInt(expirationYear) > new Date().getFullYear() + 5
  ) {
    return "Please enter a valid expiration year.";
  } else if (isNaN(parseInt(cvv)) || parseInt(cvv) < 100 || parseInt(cvv) > 999) {
    return "Please enter a valid CVV.";
  }
  return "";
}

interface Data {
  country: string;
  city: string;
  street: string;
  phone: string;
  cardnumber: string;
  expirationYear: string;
  expirationMonth: string;
  cvv: string;
}

function extactData(formData: FormData): Data {
  const country = formData.get("country") as string;
  const city = formData.get("city") as string;
  const street = formData.get("street") as string;
  const phone = formData.get("phone") as string;
  const cardnumber = formData.get("cardnumber") as string;
  const expirationYear = formData.get("expirationYear") as string;
  const expirationMonth = formData.get("expirationMonth") as string;
  const cvv = formData.get("cvv") as string;

  return {
    country,
    city,
    street,
    phone,
    cardnumber,
    expirationYear,
    expirationMonth,
    cvv,
  };
}

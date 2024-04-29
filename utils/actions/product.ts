"use server";

import { getServerSession } from "next-auth";
import { Res, notAuthorized, notFound, serverSideError } from "../http-helpers";
import { authOptions } from "../authOptions";
import User from "@/models/User";
import Product from "@/models/Product";
import { S3 } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import { connectDB } from "../connectDB";
import { ProductDoc, UserDoc } from "@/types/mongoModels";
import { revalidatePath } from "next/cache";

const s3 = new S3({
  region: "eu-central-1",
});

interface Data {
  title: string;
  description: string;
  price: number;
  shippingPrice: number;
  qty: number;
  formData: FormData;
}

interface AddProdudctRes extends Res {
  productId?: string;
}

export const addProduct: (data: Data) => Promise<AddProdudctRes> = async data => {
  try {
    const images = data.formData.getAll("file") as File[];

    const validationMessage = validate(data);
    if (validationMessage) {
      return { error: true, code: 422, message: validationMessage };
    }

    const session = await getServerSession(authOptions);
    if (!session || !session.user.isAdmin) {
      return notAuthorized();
    }

    await connectDB();
    const currentUser = (await User.findById(session.user.id).select("isAdmin")) as UserDoc;
    if (!currentUser) {
      return notFound();
    } else if (!currentUser.isAdmin) {
      return notAuthorized();
    }

    const imagesNames: string[] = [];

    for (let index = 0; index < images.length; index++) {
      const image = images[index];

      const bufferedImage = await image.arrayBuffer();
      const filename = "avatar-" + uuidv4() + "." + image.name.split(".").pop();
      imagesNames.push(filename);

      await s3.putObject({
        Bucket: "eco-alt-project",
        Key: filename,
        Body: Buffer.from(bufferedImage),
        ContentType: image.type,
      });
    }

    const { title, description, price, shippingPrice, qty } = data;
    const product = await Product.create({
      title,
      description,
      price,
      shippingPrice,
      qty,
      images: imagesNames,
      reviews: [],
    });

    revalidatePath("/admin/products");
    revalidatePath("/admin/overview");
    revalidatePath("/");

    return {
      error: false,
      message: "Product created successfully",
      code: 201,
      productId: product._id.toString(),
    };
  } catch (error) {
    return serverSideError();
  }
};

interface EditProductData extends Data {
  productId: string;
}

export const editProduct: (data: EditProductData) => Promise<AddProdudctRes> = async data => {
  try {
    const images = data.formData.getAll("file") as (File | string)[];

    const validationMessage = validate(data);
    if (validationMessage) {
      return { error: true, code: 422, message: validationMessage };
    }

    const session = await getServerSession(authOptions);
    if (!session || !session.user.isAdmin) {
      return notAuthorized();
    }

    await connectDB();
    const currentUser = (await User.findById(session.user.id).select("isAdmin")) as UserDoc;
    const product = (await Product.findById(data.productId)) as ProductDoc;
    if (!currentUser || !product) {
      return notFound();
    } else if (!currentUser.isAdmin) {
      return notAuthorized();
    }

    const newImagesNames: string[] = [];

    for (let index = 0; index < images.length; index++) {
      const image = images[index];

      if (typeof image !== "string") {
        const bufferedImage = await image.arrayBuffer();
        const filename = "avatar-" + uuidv4() + "." + image.name.split(".").pop();
        newImagesNames.push(filename);

        await s3.putObject({
          Bucket: "eco-alt-project",
          Key: filename,
          Body: Buffer.from(bufferedImage),
          ContentType: image.type,
        });
      }
    }

    for (let index = 0; index < product.images.length; index++) {
      const image = product.images[index];

      if (!images.includes(image)) {
        s3.deleteObject({
          Bucket: "eco-alt-project",
          Key: image,
        });
      }
    }

    product.title = data.title;
    product.description = data.description;
    product.price = data.price;
    product.shippingPrice = data.shippingPrice;
    product.qty = data.qty;
    product.images = [...product.images.filter(img => images.includes(img)), ...newImagesNames];

    await product.save();

    revalidatePath("/admin/products");
    revalidatePath("/");
    revalidatePath(`/products/${product._id}`);

    return {
      error: false,
      message: "Product created successfully",
      code: 201,
      productId: product._id.toString(),
    };
  } catch (error) {
    return serverSideError();
  }
};

function validate({ title, description, formData, price, qty, shippingPrice }: Data): string {
  const images = formData.getAll("files") as (File | string)[];

  if (title.trim().length < 3) {
    return "Title must be at least 3 characters long.";
  } else if (description.trim().length < 3) {
    return "Description must be at least 3 characters long.";
  } else if (price < 0 || qty < 0 || shippingPrice < 0) {
    return "Price & qunatity & shipping price, All must be greater than 0.";
  }

  for (let index = 0; index < images.length; index++) {
    if (typeof images[index] !== "string") {
      if (!["png", "jpeg", "jpg"].includes((images[index] as File).name.split(".").pop() || "")) {
        return "Unsupported image files. Supported types: png, jpg, jpeg.";
      }
    }
  }

  return "";
}

interface DeleteProductData {
  productId: string;
}

export const swtichIsDeletedProduct: (
  data: DeleteProductData
) => Promise<AddProdudctRes> = async data => {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user.isAdmin) {
      return notAuthorized();
    }

    await connectDB();
    const currentUser = (await User.findById(session.user.id).select("isAdmin")) as UserDoc;
    const product = (await Product.findById(data.productId).select("isDeleted")) as ProductDoc;
    if (!currentUser || !product) {
      return notFound();
    } else if (!currentUser.isAdmin) {
      return notAuthorized();
    }

    product.isDeleted = !product.isDeleted;

    await product.save();

    revalidatePath("/admin/products");
    revalidatePath(`/products/${product._id}`);
    revalidatePath("/");
    revalidatePath("/cart");

    return {
      error: false,
      message: "Product created successfully",
      code: 201,
      productId: product._id.toString(),
    };
  } catch (error) {
    return serverSideError();
  }
};

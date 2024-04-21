"use client";

import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
  Textarea,
} from "@nextui-org/react";
import { Pen, Plus } from "lucide-react";
import ImagesInput from "./ImagesInput";
import Alert from "@/components/UI/ErrorAlert";
import { serverSideError } from "@/utils/http-helpers";
import { addProduct, editProduct } from "@/utils/actions/product";
import { useRouter } from "next/navigation";
import SubmitBtn from "./SubmitBtn";

interface Props {
  mode: "add" | "edit";
  productId?: string;
  initialTitle?: string;
  initialDescription?: string;
  initialPrice?: number;
  initialShippingPrice?: number;
  initialQty?: number;
  initialFiles?: (File | string)[];
}

const Dialog: React.FC<Props> = props => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [files, setFiles] = useState<(File | string)[]>(props.initialFiles || []);
  const [previews, setPreviews] = useState<string[]>((props.initialFiles as string[]) || []);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    if (files.length === 0 || files.length === previews.length) {
      return;
    }
    const newFile = files[files.length - 1];
    if (typeof newFile !== "string") {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviews(old => [...old, fileReader.result as string]);
      };
      fileReader.readAsDataURL(newFile);
    }
  }, [files, previews.length]);

  const removeImage = (index: number) => {
    const newImagesArr = files.slice(0, index).concat(files.slice(index + 1));
    const newPreviewArr = previews.slice(0, index).concat(previews.slice(index + 1));
    setFiles(newImagesArr);
    setPreviews(newPreviewArr);
  };

  async function submitHandler(formData: FormData) {
    setError("");
    setLoading(true);
    try {
      const title = formData.get("title") as string;
      const description = formData.get("description") as string;
      const price = parseFloat(formData.get("price") as string);
      const shippingPrice = parseFloat(formData.get("shippingPrice") as string);
      const qty = parseInt(formData.get("qty") as string);
      const productId = formData.get("productId") as string;
      const filesFormData = new FormData();

      for (let index = 0; index < files.length; index++) {
        filesFormData.append("file", files[index]);
      }

      const data = {
        title,
        description,
        price,
        shippingPrice,
        qty,
        formData: filesFormData,
      };

      let response;
      if (props.mode === "add") {
        response = await addProduct(data);
      } else {
        response = await editProduct({ ...data, productId });
      }

      if (response.error) {
        setError(response.message);
      } else if (!response.error) {
        router.push(`/products/${response.productId}`);
      }
    } catch (error) {
      setError(serverSideError().message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="text-end">
        {props.mode === "add" ? (
          <Button onPress={onOpen} color="success">
            Add Product <Plus />
          </Button>
        ) : (
          <Pen className="text-secondary cursor-pointer" onClick={onOpen} />
        )}
      </div>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="top-center"
        backdrop="blur"
        scrollBehavior="outside"
      >
        <ModalContent>
          {onClose => (
            <form action={submitHandler}>
              <ModalHeader className="flex flex-col gap-1">
                {props.mode === "add" ? "Add Product" : "Edit Product"}
              </ModalHeader>
              <ModalBody>
                <input type="hidden" name="productId" value={props.productId} />
                <Input
                  defaultValue={props.initialTitle}
                  name="title"
                  autoFocus
                  label="Title"
                  placeholder="Enter the product's title"
                  variant="bordered"
                />
                <Textarea
                  defaultValue={props.initialDescription}
                  name="description"
                  label="Description"
                  placeholder="Enter the product's description"
                  variant="bordered"
                />
                <div className="flex gap-3">
                  <Input
                    defaultValue={props.initialPrice?.toString() || ""}
                    name="price"
                    type="number"
                    label="Price"
                    variant="bordered"
                    min="0"
                    step="0.01"
                    startContent={<>$</>}
                  />
                  <Input
                    defaultValue={props.initialShippingPrice?.toString() || ""}
                    name="shippingPrice"
                    type="number"
                    label="Shipping Price"
                    variant="bordered"
                    min="0"
                    step="0.01"
                    startContent={<>$</>}
                  />
                  <Input
                    defaultValue={props.initialQty?.toString() || ""}
                    name="qty"
                    type="number"
                    label="Quantity"
                    variant="bordered"
                    min="0"
                    step="1"
                  />
                </div>
                <ImagesInput setFiles={setFiles} previews={previews} remove={removeImage} />
              </ModalBody>
              <ModalFooter className="flex-col">
                {error && <Alert text={error} />}
                <div className="gap-3 justify-end flex-row flex">
                  <Button color="danger" variant="flat" onPress={onClose}>
                    Close
                  </Button>
                  <SubmitBtn text={props.mode === "add" ? "Add Product" : "Save Changes"} />
                </div>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default Dialog;

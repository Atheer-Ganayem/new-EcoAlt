"use client";

import { Avatar, Badge, Card, CardBody, Chip, Input } from "@nextui-org/react";
import { Check, Pen } from "lucide-react";
import React, { useRef, useState } from "react";
import SubmitBtn from "../UI/SubmitBtn";
import { useFormState } from "react-dom";
import { updateUserDetails } from "@/utils/actions/user";
import ErrorAlert from "@/components/UI/ErrorAlert";

interface Props {
  avatar: string;
  name: string;
  email: string;
  isAdmin: boolean;
  userId: string;
}

const Details: React.FC<Props> = ({ avatar, email, name, isAdmin, userId }) => {
  const [state, formAction] = useFormState(updateUserDetails, {
    error: false,
    code: 200,
    message: "",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string>("");
  const [isDisabled, setIsDisabled] = useState<{ name: boolean; email: boolean }>({
    name: true,
    email: true,
  });

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files
      ? event.target.files.length > 0
        ? event.target.files![0]
        : null
      : null;

    if (!file) {
      return setPreview("");
    }

    const fileReader = new FileReader();

    fileReader.onload = () => {
      setPreview(fileReader.result as string);
    };

    fileReader.readAsDataURL(file);
  }

  return (
    <form action={formAction}>
      <Card className="w-full max-w-96 p-5 mx-auto flex flex-col items-center gap-6">
        <input type="hidden" value={userId} name="userId" />
        <Badge
          className="bg-transparent"
          content={
            <Pen
              className="cursor-pointer text-danger"
              onClick={() => fileInputRef.current?.click()}
            />
          }
        >
          <Avatar
            src={preview ? preview : process.env.AWS + avatar}
            className="w-24 h-24 text-large"
          />
        </Badge>
        <Chip variant="flat" color={isAdmin ? "danger" : "primary"}>
          {isAdmin ? "Admin" : "User"}
        </Chip>
        <input type="file" hidden name="avatar" ref={fileInputRef} onChange={handleImageChange} />
        <Badge
          className="bg-transparent"
          classNames={{ base: "w-full" }}
          content={
            isDisabled.name ? (
              <Pen
                className="cursor-pointer text-danger"
                onClick={() => setIsDisabled(prev => ({ ...prev, name: false }))}
              />
            ) : (
              <Check
                className="cursor-pointer text-success"
                onClick={() => setIsDisabled(prev => ({ ...prev, name: true }))}
              />
            )
          }
        >
          <Input
            defaultValue={name}
            name="name"
            label="Username"
            variant="bordered"
            className="w-full min-w-full max-w-full"
            isDisabled={isDisabled.name}
          />
        </Badge>
        <Badge
          className="bg-transparent"
          classNames={{ base: "w-full" }}
          content={
            isDisabled.email ? (
              <Pen
                className="cursor-pointer text-danger"
                onClick={() => setIsDisabled(prev => ({ ...prev, email: false }))}
              />
            ) : (
              <Check
                className="cursor-pointer text-success"
                onClick={() => setIsDisabled(prev => ({ ...prev, email: true }))}
              />
            )
          }
        >
          <Input
            defaultValue={email}
            name="email"
            type="email"
            label="Email"
            variant="bordered"
            className="w-full min-w-full max-w-full"
            isDisabled={isDisabled.email}
          />
        </Badge>
        {state.error && <ErrorAlert text={state.message} />}
        {!state.error && state.code === 201 && (
          <div className="border-success border-3 rounded-lg">
            <Card>
              <CardBody className="bg-success-100 text-current flex gap-3 flex-row">
                <Check />
                {state.message}
              </CardBody>
            </Card>
          </div>
        )}
        <SubmitBtn text="Save Changes" />
      </Card>
    </form>
  );
};

export default Details;

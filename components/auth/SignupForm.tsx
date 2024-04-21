"use client";

import { Input } from "@nextui-org/react";
import { Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";
import AvatarInput from "./AvatarInput";
import Alert from "../UI/ErrorAlert";
import { useFormState } from "react-dom";
import { signup } from "@/utils/actions/auth";
import SubmitBtn from "../UI/SubmitBtn";
import { signIn } from "next-auth/react";
import { redirect } from "next/navigation";

const SignupForm = () => {
  const [state, formAction] = useFormState(signup, {
    message: "",
    error: false,
    code: 200,
    email: "",
    password: "",
  });
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

  if (state.code === 201) {
    signIn("credentials", {
      redirect: false,
      callbackUrl: "/",
      email: state.email,
      password: state.password,
    });
    redirect("/");
  }

  return (
    <form className="flex flex-col gap-5 items-center w-80 sm:w-96" action={formAction}>
      <AvatarInput />
      <Input
        name="name"
        type="text"
        label="Username"
        variant="bordered"
        placeholder="Enter your username"
        className="max-w-xs"
      />
      <Input
        name="email"
        type="email"
        label="Email"
        variant="bordered"
        placeholder="Enter your email"
        className="max-w-xs"
      />
      <Input
        name="password"
        label="Password"
        variant="bordered"
        placeholder="Enter your password"
        endContent={
          <button
            className="focus:outline-none"
            type="button"
            onClick={() => setIsPasswordVisible(prev => !prev)}
          >
            {isPasswordVisible ? (
              <Eye className="text-2xl text-default-400 pointer-events-none" />
            ) : (
              <EyeOff className="text-2xl text-default-400 pointer-events-none" />
            )}
          </button>
        }
        type={isPasswordVisible ? "text" : "password"}
        className="max-w-xs"
      />
      <Input
        name="confirmPassword"
        label="Confirm Password"
        variant="bordered"
        placeholder="Enter your password again"
        endContent={
          <button
            className="focus:outline-none"
            type="button"
            onClick={() => setIsPasswordVisible(prev => !prev)}
          >
            {isPasswordVisible ? (
              <Eye className="text-2xl text-default-400 pointer-events-none" />
            ) : (
              <EyeOff className="text-2xl text-default-400 pointer-events-none" />
            )}
          </button>
        }
        type={isPasswordVisible ? "text" : "password"}
        className="max-w-xs"
      />
      {state.error && <Alert text={state.message} />}
      <SubmitBtn text="Signup" />
    </form>
  );
};

export default SignupForm;

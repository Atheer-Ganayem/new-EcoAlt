"use client";

import { Button, Input } from "@nextui-org/react";
import { Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";
import ErrorAlert from "../UI/ErrorAlert";
import { serverSideError } from "@/utils/http-helpers";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const LoginForm = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const router = useRouter();

  async function submitHandler(formData: FormData) {
    setLoading(true);
    setError("");
    try {
      const email = formData.get("email");
      const password = formData.get("password");

      signIn("credentials", {
        redirect: false,
        callbackUrl: "/",
        email,
        password,
      }).then(result => {
        {
          if (result?.ok) {
            router.replace("/");
          } else if (!result?.ok) {
            setError("Incorrect email or password.");
            setLoading(false);
          }
        }
      });
    } catch (error) {
      setError(serverSideError().message);
    }
  }

  return (
    <form className="flex flex-col gap-5 w-80 sm:w-96 items-center" action={submitHandler}>
      <Image src="/logo.png" width={200} height={200} alt="logo" />
      <Input
        name="email"
        isClearable
        type="email"
        label="Email"
        variant="bordered"
        placeholder="Enter your email"
        onClear={() => console.log("input cleared")}
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
      {error && <ErrorAlert text={error} />}
      <p>
        Forgot your password? click{" "}
        <Link href="#" className="text-success underline">
          here
        </Link>
      </p>
      <Button type="submit" className="w-full" color="success" isLoading={loading}>
        Login
      </Button>
    </form>
  );
};

export default LoginForm;

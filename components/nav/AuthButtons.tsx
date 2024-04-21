"use client";

import { Button, NavbarItem } from "@nextui-org/react";
import Link from "next/link";
import React from "react";

const AuthButtons = () => {
  return (
    <>
      <NavbarItem>
        <Button color="success" variant="bordered" as={Link} href="/auth?mode=login">
          Login
        </Button>
      </NavbarItem>
      <NavbarItem className="hidden lg:block">
        <Button color="success" variant="solid" as={Link} href="/auth?mode=signup">
          Sign Up
        </Button>
      </NavbarItem>
    </>
  );
};

export default AuthButtons;

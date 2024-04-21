"use client";

import React from "react";
import { NextUIProvider as Provider } from "@nextui-org/react";
import { ThemeProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";

const NextUIProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
      <Provider>
        <ThemeProvider attribute="class" defaultTheme="dark" themes={["light", "dark"]}>
          {children}
        </ThemeProvider>
      </Provider>
    </SessionProvider>
  );
};

export default NextUIProvider;

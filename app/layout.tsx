import type { Metadata } from "next";
import "./globals.css";
import NextUIProvider from "./NextUIProvider";
import Navbar from "@/components/nav/Navbar";

export const metadata: Metadata = {
  title: "EcoAlt",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-[100vh]">
        <NextUIProvider>
          <Navbar />
          <main>{children}</main>
        </NextUIProvider>
      </body>
    </html>
  );
}

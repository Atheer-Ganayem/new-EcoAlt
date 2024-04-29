"use client";

import React from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
} from "@nextui-org/react";
import ThemeChangerDropDown from "../UI/ThemeChangerDropDown";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import AuthButtons from "./AuthButtons";
import AvatarDropdown from "./AvatarDropdown";
import { Home, Package, Search, ShoppingCart } from "lucide-react";
import Image from "next/image";
import AdminDropdown from "./AdminDropdown";

const links = [
  { text: "Home", path: "/", auth: false, icon: Home },
  { text: "Search", path: "/search", auth: false, icon: Search },
  { text: "My Orders", path: "/my-orders", auth: true, icon: Package },
];

const adminLinks = [
  { text: "Overview", path: "/admin/overview" },
  { text: "Users", path: "/admin/users" },
  { text: "Products", path: "/admin/products" },
  { text: "Orders", path: "/admin/orders" },
];

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const path = usePathname();
  const { data: session, status } = useSession();

  return (
    <Navbar onMenuOpenChange={setIsMenuOpen} isBordered>
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <Link href="/">
          <NavbarBrand className="flex gap-3">
            <Image src="/logo.png" width={50} height={50} alt="logo" />
            <p className="font-bold text-inherit text-xl">
              <span className="text-success">Eco</span>Alt
            </p>
          </NavbarBrand>
        </Link>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {links.map((link, index) => {
          return (
            ((link.auth && session) || !link.auth) && (
              <Link key={index} href={link.path}>
                <NavbarItem
                  isActive={path === link.path}
                  className={`flex gap-1 items-center ${
                    path === link.path ? "text-success" : "text-foreground"
                  }`}
                >
                  <link.icon size={22} />
                  {link.text}
                </NavbarItem>
              </Link>
            )
          );
        })}
        {session?.user.isAdmin && <AdminDropdown />}
      </NavbarContent>
      <NavbarContent justify="end">
        {status === "loading" ? null : !session ? (
          <AuthButtons />
        ) : (
          <>
            <NavbarItem>
              <Link href="/cart">
                <ShoppingCart />
              </Link>
            </NavbarItem>
            <AvatarDropdown user={session.user} />
          </>
        )}
        <NavbarItem>
          <ThemeChangerDropDown />
        </NavbarItem>
      </NavbarContent>
      <NavbarMenu>
        {links.map((link, index) => (
          <NavbarMenuItem key={index}>
            <Link
              className={`w-full ${link.path === path ? "text-success" : "text-foreground"}`}
              href={link.path}
            >
              {link.text}
            </Link>
          </NavbarMenuItem>
        ))}
        {session?.user.isAdmin &&
          adminLinks.map((link, index) => (
            <NavbarMenuItem key={index}>
              <Link
                className={`w-full ${link.path === path ? "text-success" : "text-foreground"}`}
                href={link.path}
              >
                {link.text}
              </Link>
            </NavbarMenuItem>
          ))}
      </NavbarMenu>
    </Navbar>
  );
}

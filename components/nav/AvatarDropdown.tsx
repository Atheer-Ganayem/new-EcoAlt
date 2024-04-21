"use client";

import { Avatar, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import React from "react";

interface Props {
  user: {
    name: string;
    email: string;
    id: string;
    avatar: string;
  };
}

const AvatarDropdown: React.FC<Props> = ({ user }) => {
  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <Avatar
          isBordered
          as="button"
          className="transition-transform"
          src={`${process.env.AWS}${user.avatar}`}
          color="success"
        />
      </DropdownTrigger>
      <DropdownMenu aria-label="Profile Actions" variant="flat">
        <DropdownItem key="profile" className="h-14 gap-2">
          <p className="font-semibold">{user.name}</p>
          <p className="font-semibold">{user.email}</p>
        </DropdownItem>
        <DropdownItem key="settings" as={Link} href={`/users/${user.id}`}>
          Settings
        </DropdownItem>
        <DropdownItem key="logout" color="danger" className="text-danger" onClick={() => signOut()}>
          Log Out
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export default AvatarDropdown;

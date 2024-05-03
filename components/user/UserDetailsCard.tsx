"use client";

import { UserDoc } from "@/types/mongoModels";
import React from "react";
import Details from "./Details";
import PasswordChange from "./PasswordChange";
import DeleteUserBtn from "./DeleteUserBtn";

interface Props {
  user: UserDoc;
}

const UserDetailsCard: React.FC<Props> = ({ user }) => {
  return (
    <>
      <Details
        avatar={user.avatar}
        email={user.email}
        name={user.name}
        isAdmin={user.isAdmin}
        userId={user._id.toString()}
      />
      <PasswordChange userId={user._id.toString()} />
      <div>
        <DeleteUserBtn />
      </div>
    </>
  );
};

export default UserDetailsCard;

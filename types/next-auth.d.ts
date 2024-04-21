import { type DefaultSession, type DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: DefaultSession["user"] & {
      id: string;
      name: string;
      email: string;
      isAdmin: boolean;
      avatar: string;
    };
  }
  interface User extends DefaultUser {
    id: string;
    name: string;
    email: string;
    avatar: string;
    isAdmin: boolean;
  }
}

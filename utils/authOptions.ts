import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "@/utils/connectDB";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { AuthOptions } from "next-auth";
import { UserDoc } from "@/types/mongoModels";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials): Promise<any> {
        try {
          if (!credentials || !credentials.email || !credentials.password) {
            return null;
          }

          await connectDB();

          const user = (await User.findOne({ email: credentials.email })) as UserDoc;

          if (!user) {
            return null;
          }

          const isPwMatch = await bcrypt.compare(credentials.password, user.password);

          if (!isPwMatch) {
            return null;
          }

          return {
            email: user.email,
            name: user.name,
            id: user._id.toString(),
            isAdmin: user.isAdmin,
            avatar: user.avatar,
          };
        } catch (error) {
          console.log(error);
        }
      },
    }),
  ],

  callbacks: {
    async session({ session, token }) {
      if (token.id) {
        session.user.id = token.id as string;
        session.user.isAdmin = token.isAdmin as boolean;
        session.user.avatar = token.avatar as string;
      }

      return session;
    },
    async jwt(params) {
      if (params.user) {
        params.token.id = params.user.id;
        params.token.isAdmin = params.user.isAdmin;
        params.token.avatar = params.user.avatar;
      }
      return params.token;
    },
  },

  session: {
    strategy: "jwt" as any,
  },
  secret: process.env.authSecret,
  pages: {
    signIn: "/auth",
  },
};

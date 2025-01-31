import NextAuth from "next-auth";
import authConfig from "@/auth.config";
// import { userFormData } from "./lib/createUserData";
// import { getUserById } from "./queries/user";
// import { db } from "./lib/mogo";

export const { auth, handlers, signIn, signOut } = NextAuth({
  ...authConfig,
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, session, trigger }) {
      // Update JWT when `update()` is called on the client
      if (trigger === "update") {
        return { ...token, ...session.user };
      }
      // console.log("🔐 JWT CALLBACK", token, session, user);
      if (!token.role) {
        token.role = "admin";
        token.isAdmin = true;
      }
      return token;
    },
  },
});
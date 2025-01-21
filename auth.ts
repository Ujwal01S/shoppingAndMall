import NextAuth from "next-auth";
import authConfig from "@/auth.config";
import { getUserById } from "./queries/user";
// import { userFormData } from "./lib/createUserData";
// import { getUserById } from "./queries/user";
// import { db } from "./lib/mogo";

export const { auth, handlers, signIn, signOut } = NextAuth({
  ...authConfig,
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token }) {
      if (!token.sub) return token;

      // const exitingUser = await getUserById(token.sub);

      const exitingUser = await getUserById(token.sub) as unknown as { isAdmin: boolean, name: string, imageUrl?: string, _id: string, role: string };

      if (!exitingUser) return token;


      token.role = exitingUser.role;
      token.name = exitingUser.name;
      token.isAdmin = exitingUser.isAdmin;
      token.picture = exitingUser.imageUrl;
      // token.sub = exitingUser._id;

      // token.role = exitingUser.isAdmin ? "admin" : "user"


      // console.log("TokenFromAuth", token);
      return token;
    },
  }
});

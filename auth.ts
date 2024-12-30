import NextAuth from "next-auth";
import authConfig from "@/auth.config";
import { getUserById } from "./queries/user";

export const { auth, handlers, signIn, signOut } = NextAuth({
  ...authConfig,
  // pages: {
  //   signIn:"/login",
  // },

  callbacks: {
    async jwt({ token, trigger, session }) {
      if (!token.sub) return token;

      // const exitingUser = await getUserById(token.sub);

      const exitingUser = await getUserById(token.sub) as unknown as { isAdmin: boolean, name: string, role?: string };

      if (!exitingUser) return token;
      // token.role = exitingUser.role;
      token.name = exitingUser.name;
      token.isAdmin = exitingUser.isAdmin;

      if (!token.role) {
        token.role = "user";
        console.log("here");
      }
      if (trigger === "update" && session.user.role) {
        token.role = session.user.role;
      }
      // console.log("TokenFromAuth", token);
      return token;
    },

    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      if (token.role && session.user) {
        session.user.role = token.role as "admin" | "user";
      }

      if (session.user) {
        session.user.name = token.name as string;
        session.user.isAdmin = token.isAdmin as boolean;
      }
      // console.log("SessionFromAuth",session);
      return session;
    },
  },

  session: {
    strategy: "jwt",
  },
});

import bcrypt from "bcryptjs";
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { User } from "./model/user";
// import { getUserById } from "./queries/user";

export default {
  providers: [
    Credentials({
      async authorize(credentials) {
        // console.log("2nd");
        if (credentials == undefined) return null;

        try {
          const user = await User.findOne({
            name: credentials?.name,
          });
          if (user) {
            const isMatch = await bcrypt.compare(
              credentials?.password as string,
              user.password
            );
            if (isMatch) {
              // Include role in the user object
              return { ...user.toObject(), role: user.isAdmin ? "admin" : "user" };
            } else {
              throw new Error("check your password");
            }
          } else {
            throw new Error("User doesn't exists");
          }
        } catch (error) {
          if (error instanceof Error) {
            throw new Error("User doesn't exits");
          } else {
            throw new Error("Something went wrong!");
          }
        }
      },
    }),
  ],
  callbacks: {
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      // console.log("Session callback:", token, session);
      if (session.user) {
        const newSession = {
          ...session,
          user: { ...session.user, ...token, image: token.picture },
        };
        return newSession;
      }

      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
} satisfies NextAuthConfig;
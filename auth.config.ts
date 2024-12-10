import bcrypt from "bcryptjs";
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { User } from "./model/user";

export default {
  providers: [
    Credentials({
      async authorize(credentials) {
        // console.log("2nd");
        if (credentials === null || credentials === undefined) return null;

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
              return user;
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
} satisfies NextAuthConfig;

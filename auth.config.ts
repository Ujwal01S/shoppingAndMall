
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
  callbacks: {
    // async jwt({ token, trigger, session }) {
    //   if (!token.sub) return token;

    //   // const exitingUser = await getUserById(token.sub);

    //   const exitingUser = await getUserById(token.sub) as unknown as { isAdmin: boolean, name: string, imageUrl?: string };

    //   if (!exitingUser) return token;


    //   // token.role = exitingUser.role;
    //   token.name = exitingUser.name;
    //   token.isAdmin = exitingUser.isAdmin;
    //   token.picture = exitingUser.imageUrl;

    //   // token.role = exitingUser.isAdmin ? "admin" : "user"

    //   if (!token.role) {
    //     token.role = "user"
    //   }

    //   // if (token.isAdmin) {
    //   //   token.role = "admin";
    //   //   console.log("here");
    //   // } else {
    //   //   token.role = "user";
    //   // }

    //   if (trigger === "update" && session?.user?.role) {
    //     token.role = session.user.role;
    //   }
    //   // console.log("TokenFromAuth", token);
    //   return token;
    // },

    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      // if (token.role && session.user) {
      //   session.user.role = token.role as "admin" | "user";
      // }

      if (session.user) {
        session.user.name = token.name as string;
        session.user.isAdmin = token.isAdmin as boolean;
        session.user.image = token.picture as string;
        session.user.role = token.role as "admin" | "user";
      }


      // console.log({ session });
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },

} satisfies NextAuthConfig;

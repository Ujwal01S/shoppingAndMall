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
    async jwt({ token, trigger, session }) {
      if (!token.sub) return token;

      // const exitingUser = await getUserById(token.sub);

      const exitingUser = await getUserById(token.sub) as unknown as { isAdmin: boolean, name: string, imageUrl?: string, _id: string };

      if (!exitingUser) return token;


      // token.role = exitingUser.role;
      token.name = exitingUser.name;
      token.isAdmin = exitingUser.isAdmin;
      token.picture = exitingUser.imageUrl;
      // token.sub = exitingUser._id;

      // token.role = exitingUser.isAdmin ? "admin" : "user"

      if (!token.role) {
        token.role = "user"
      }

      // if (token.isAdmin) {
      //   token.role = "admin";
      //   console.log("here");
      // } else {
      //   token.role = "user";
      // }

      // let userData = { name: token.name, email: token.email as string, role: token.role as string, picture: token.picture as string };


      if (trigger === "update" && session?.user?.role) {
        token.role = session.user.role;

        // userData = { ...userData, role: token.role as string }

        // const convertedUserData = userFormData(userData);

        // await fetch(
        //   `http://localhost:3000/api/user/${token.sub}`,
        //   {
        //     method: "PUT",
        //     headers: {
        //       "Content-Type": "multipart/form-data",
        //     },
        //     body: convertedUserData,
        //   }
        // );
      }

      // console.log("TokenFromAuth", token);
      return token;
    },
  }
});

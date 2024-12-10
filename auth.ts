import NextAuth from "next-auth";
import authConfig from "@/auth.config";
import { getUserById } from "./queries/user";


export const { auth, handlers, signIn, signOut } = NextAuth({
  ...authConfig,
  // pages: {
  //   signIn:"/login",
  // },

  callbacks:{
    async jwt({token}){
      if(!token.sub) return token;

      const exitingUser = await getUserById(token.sub);

      if(!exitingUser) return token;
      token.role = exitingUser.role;
      token.name = exitingUser.name;
      token.email = exitingUser.email;
      token.isAdmin = exitingUser.isAdmin
      return token;
    },

    async session({token, session}){
      if(token.sub && session.user){
        session.user.id = token.sub
      }
      if(token.role && session.user){
        session.user.role = token.role as "admin" | "user";
      }

      if(session.user){
        session.user.name = token.name;
        session.user.email = token.email as string
        session.user.isAdmin = token.isAdmin as boolean;
      }
      return session
    }
  },

});

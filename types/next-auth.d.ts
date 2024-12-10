import { DefaultSession, DefaultJWT } from "next-auth";



type UserRole = "admin" | "user";

export type ExtendedUser = DefaultSession["user"] & {
  role: UserRole;
  isAdmin?:boolean
};

export interface ExtendedJWT extends DefaultJWT {
  role?: UserRole;
  name?: string;
  email?: string;
}

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}

declare module "next-auth/jwt"{
    interface JWT{
        role:UserRole
        name:string
        email:string
        
    }
}

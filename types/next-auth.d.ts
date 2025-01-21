import { DefaultSession /*DefaultJWT*/ } from "next-auth";
import { JWT } from "next-auth/jwt";

type UserRole = "admin" | "user";

// export type ExtendedUser = DefaultSession["user"] & {
//   role: UserRole;
//   isAdmin?: boolean;
// };

// export interface ExtendedJWT extends DefaultJWT {
//   role?: UserRole;
//   name?: string;
//   email?: string;
// }

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string
      role: UserRole;
      name: string;
      email: string;
      isAdmin?: boolean;
      image?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWTNew extends JWT {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    isAdmin?: boolean;
  }
}

import { getToken } from "next-auth/jwt"
import { NextRequest, NextResponse } from "next/server"

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request, secret: process.env.AUTH_SECRET });

    const { nextUrl } = request;
    let role;
    if (token) {
        role = token.role as unknown as string
    }
    // console.log("Role From Middleware:", role);
    const isAdmin = role === "admin";

    const isAdminRoute = nextUrl.pathname.includes("/admin");

    if (!isAdmin && isAdminRoute) {
        return NextResponse.redirect(new URL("/", nextUrl));
    }

    // console.log("middleware reached");

    return;
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
    ]
}
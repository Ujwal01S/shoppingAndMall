
import NextAuth from "next-auth";
import authConfig from "@/auth.config";
import { NextResponse } from "next/server";



const { auth } = NextAuth(authConfig)


export default auth(async (req) => {
    const { nextUrl } = req;

    // console.log("From Middleware:", req.auth?.user)
    const isAdmin = req.auth?.user?.role === "admin";

    const isAdminRoute = nextUrl.pathname.includes("/admin");


    if (!isAdmin && isAdminRoute) {
        return NextResponse.redirect(new URL("/", nextUrl));
    }

    return;
});

export const config = {
    matcher: [
        '/admin/:path*'

    ],
};

// Application error: a client-side exception has occurred WHEN going back :- Means server and client component didn't match but has conditional rendering that is UI is displayed based on condition and that condition is not same in both server and client

// after adding middleware an error occured i.e. : Application error: a client-side exception has occurred WHEN going back
// this error occurs when you switch use role from user to admin reason behind this error is that when you switch role you update the role in auth.ts but middleware works in server side. Situation arises when client side update is not updating fast so that server and client condition doesnot match i.e. action that depends on role here shopCategory is displayed if role is admin hence contributing to error that we see here.
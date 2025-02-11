import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
// import { ProviderTheme } from "@/components/themeprovider";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { db } from "@/lib/mogo";
import { Cabin } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import QueryProvider from "@/lib/provider";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const cabin = Cabin({
  subsets: ["latin"],
});

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Shop and Malls",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await db();
  return (
    <SessionProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased ${cabin.className}`}
        >
          {/* <ProviderTheme> */}
          <QueryProvider>
            <Navbar />

            <div className=" min-h-[75vh]">{children}</div>
            <ToastContainer />

            <Footer />
          </QueryProvider>
          {/* </ProviderTheme> */}
        </body>
      </html>
    </SessionProvider>
  );
}

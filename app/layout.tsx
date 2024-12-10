import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
// import { ProviderTheme } from "@/components/themeprovider";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { db } from "@/lib/mogo";

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
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* <ProviderTheme> */}
          <Navbar />
          {children}
          <Footer />
        {/* </ProviderTheme> */}
      </body>
    </html>
  );
}

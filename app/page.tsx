// instead of importing image directly use it if image is in public just "/" is enought
"use client";

import HomepageContent from "@/components/modules/homePageModule/homepageContent";
import SearchBar from "@/components/modules/homePageModule/search";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function Home() {
  const { data: session } = useSession();

  if (session && session.user.isAdmin && session?.user?.role === "admin") {
    redirect("/admin/dashboard");
  }

  return (
    <div className="relative flex flex-col mt-20">
      <div className=" flex flex-col h-96">
        <div className="inset-0 bg-cover bg-center h-[120%] z-[-1] bg-homePageImage">
          <div className="flex flex-col z-10 items-center justify-center h-full">
            <p className="text-4xl font-bold text-white text-center">
              Search Shops and Malls
            </p>

            <p className="text-2xl font-semibold text-white">100+ shops</p>
          </div>
        </div>
      </div>

      <div className="container border-2">
        <SearchBar />
        <HomepageContent />
      </div>
    </div>
  );
}

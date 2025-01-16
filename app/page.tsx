// instead of importing image directly use it if image is in public just "/" is enought
"use client";

import HomepageContent from "@/components/modules/homePageModule/homepageContent";
import SearchBar from "@/components/modules/homePageModule/search";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const { data: session } = useSession();
  const [searchData, setSearchData] = useState<string>("");

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

      <div className="container mt-10">
        <SearchBar setSearch={setSearchData} />
        <HomepageContent searchData={searchData} />
      </div>
    </div>
  );
}

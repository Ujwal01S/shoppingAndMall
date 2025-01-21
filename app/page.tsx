"use client";
import HomeContent from "@/components/modules/homePageModule/homeContent";
import { UserRoleContextProvider } from "@/store/userRoleContext";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

// instead of importing image directly use it if image is in public just "/" is enought

// import HomepageContent from "@/components/modules/homePageModule/homepageContent";
// import SearchBar from "@/components/modules/homePageModule/search";
// import { UserRoleContextProvider } from "@/store/userRoleContext";

// import { useSession } from "next-auth/react";
// import { redirect } from "next/navigation";
// import { useState } from "react";

export default function Home() {
  const { data: session } = useSession();
  const [userRole, setUserRole] = useState<string>("user");

  useEffect(() => {
    if (session?.user.role === "admin") {
      redirect("/admin/dashboard");
    }
    if (session) {
      setUserRole(session.user.role);
    }
  }, [session]);

  return (
    <UserRoleContextProvider>
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

        <HomeContent role={userRole} />
      </div>
    </UserRoleContextProvider>
  );
}

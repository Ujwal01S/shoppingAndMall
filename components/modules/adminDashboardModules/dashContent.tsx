"use client";

import { useEffect, useState } from "react";
import SearchBar from "../homePageModule/search";
import AdminDashboardContent from ".";
import { UserRoleContextProvider } from "@/store/userRoleContext";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";

interface DashContentProps {
  role: string;
}

const DashContent = ({ role }: DashContentProps) => {
  const [searchData, setSearchData] = useState<string>("");

  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user.role === "user") {
      redirect("/");
    }
  }, [session]);

  return (
    <UserRoleContextProvider>
      <div className="container mt-10">
        <SearchBar setSearch={setSearchData} />
        {role && <AdminDashboardContent searchData={searchData} role={role} />}

        {/* <DynamicSearchBar setSearch={setSearchData} /> */}
        {/* <DynamicAdminDashboardContent searchData={searchData} /> */}
      </div>
    </UserRoleContextProvider>
  );
};

export default DashContent;

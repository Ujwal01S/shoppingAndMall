"use client";

import AdminDashboardContent from "@/components/modules/adminDashboardModules";
import SearchBar from "@/components/modules/homePageModule/search";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect } from "react";

const AdminDashboard = () => {
  const { data: session } = useSession();

  useEffect(() => {
    if (!session) {
      redirect("/");
    }
    if (!session?.user.isAdmin) {
      redirect("/");
    }
    if (session.user.role === "user") {
      redirect("/");
    }
  }, [session, session?.user]);

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
        <SearchBar />
        <AdminDashboardContent />
      </div>
    </div>
  );
};

export default AdminDashboard;

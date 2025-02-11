"use client";
import ShopFilters from "../homePageModule/shopFilters";
import AdminMallAndShops from "./adminMallAndShop";
import { useContext, useEffect } from "react";
import { UserRoleContext } from "@/store/userRoleContext";

import MobileShopFilters from "../homePageModule/mobileShopFilters";
import { useQuery } from "@tanstack/react-query";
import { getAllCategory } from "@/lib/api";

interface AdminDashboardContentProps {
  searchData: string;
  role: string;
}

const AdminDashboardContent = ({
  searchData,
  role,
}: AdminDashboardContentProps) => {
  const { setCtxUserRole } = useContext(UserRoleContext);
  useEffect(() => {
    if (role) {
      setCtxUserRole(role);
    }
  }, [role, setCtxUserRole]);

  const { data: shopFilterCategories, isLoading } = useQuery({
    queryFn: () => getAllCategory(),
    queryKey: ["category"],
  });

  return (
    <div className="mobile-xl:flex gap-4 py-10 container">
      <MobileShopFilters
        isLoading={isLoading}
        shopFilterCategories={shopFilterCategories?.categories}
        role={role}
      />
      <ShopFilters
        isLoading={isLoading}
        shopFilterCategories={shopFilterCategories?.categories}
      />

      <AdminMallAndShops searchData={searchData} />
    </div>
  );
};

export default AdminDashboardContent;

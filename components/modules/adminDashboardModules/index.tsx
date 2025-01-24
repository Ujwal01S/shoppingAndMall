"use client";
import axios from "axios";
import ShopFilters from "../homePageModule/shopFilters";
import AdminMallAndShops from "./adminMallAndShop";
import { useContext, useEffect } from "react";
import { UserRoleContext } from "@/store/userRoleContext";
import { BASE_API_URL } from "@/lib/constant";
import MobileShopFilters from "../homePageModule/mobileShopFilters";
import { useQuery } from "@tanstack/react-query";
import { getAllCategory } from "@/lib/api";

export const getAllMallData = async () => {
  const { data } = await axios.get(`${BASE_API_URL}/api/mall`);
  return data;
};

export const getAllShopData = async () => {
  const { data } = await axios.get(`${BASE_API_URL}/api/shop`);
  return data;
};

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
    <div className="mobile-xl:flex gap-4 tablet-md:px-14 tablet-lg:px-40 py-10">
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

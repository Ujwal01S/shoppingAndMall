"use client";
import axios from "axios";
import MallsAndShops from "../mallsAndShops";
import ShopFilters from "../shopFilters";
import { BASE_API_URL } from "@/lib/constant";
import { getAllCategory } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import MobileShopFilters from "../mobileShopFilters";
// import { useContext, useEffect } from "react";
// import { useSession } from "next-auth/react";
// import { UserRoleContext } from "@/store/userRoleContext";

export const getAllMallData = async () => {
  const { data } = await axios.get(`${BASE_API_URL}/api/mall`);
  return data;
};

export const getAllShopData = async () => {
  const { data } = await axios.get(`${BASE_API_URL}/api/shop`);
  return data;
};

interface HomepageContentProps {
  searchData: string | null;
  role: string;
}

const HomepageContent = ({ searchData, role }: HomepageContentProps) => {
  const { data: shopFilterCategories, isLoading } = useQuery({
    queryFn: () => getAllCategory(),
    queryKey: ["category"],
  });
  // const { setCtxUserRole } = useContext(UserRoleContext);

  // useEffect(() => {
  //   if (role) {
  //     setCtxUserRole(role);
  //   }
  // }, [role, setCtxUserRole]);
  return (
    <div className="mobile-xl:flex gap-4 container py-10">
      <MobileShopFilters
        isLoading={isLoading}
        shopFilterCategories={shopFilterCategories?.categories}
        role={role}
      />
      <ShopFilters
        shopFilterCategories={shopFilterCategories?.categories}
        isLoading={isLoading}
      />

      <MallsAndShops searchData={searchData} />
    </div>
  );
};

export default HomepageContent;

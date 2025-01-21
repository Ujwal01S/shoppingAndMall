"use client";
import axios from "axios";
import MallsAndShops from "../mallsAndShops";
import ShopFilters from "../shopFilters";
// import { useContext, useEffect } from "react";
// import { useSession } from "next-auth/react";
// import { UserRoleContext } from "@/store/userRoleContext";

export const getAllMallData = async () => {
  const { data } = await axios.get("/api/mall");
  return data;
};

export const getAllShopData = async () => {
  const { data } = await axios.get("/api/shop");
  return data;
};

interface HomepageContentProps {
  searchData: string | null;
  // role?: string;
}

const HomepageContent = ({ searchData }: HomepageContentProps) => {
  // const { setCtxUserRole } = useContext(UserRoleContext);

  // useEffect(() => {
  //   if (role) {
  //     setCtxUserRole(role);
  //   }
  // }, [role, setCtxUserRole]);
  return (
    <div className="flex gap-4 px-40 py-10">
      <ShopFilters />

      <MallsAndShops searchData={searchData} />
    </div>
  );
};

export default HomepageContent;

"use client";
import axios from "axios";
import ShopFilters from "../homePageModule/shopFilters";
import AdminMallAndShops from "./adminMallAndShop";
import { useContext, useEffect } from "react";
import { UserRoleContext } from "@/store/userRoleContext";

export const getAllMallData = async () => {
  const { data } = await axios.get("/api/mall");
  return data;
};

export const getAllShopData = async () => {
  const { data } = await axios.get("/api/shop");
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
  return (
    <div className="flex gap-4 px-40 py-10">
      <ShopFilters />

      <AdminMallAndShops searchData={searchData} />
    </div>
  );
};

export default AdminDashboardContent;

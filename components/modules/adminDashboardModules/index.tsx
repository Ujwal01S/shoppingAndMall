"use client";
import axios from "axios";
import ShopFilters from "../homePageModule/shopFilters";
import AdminMallAndShops from "./adminMallAndShop";

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
}

const AdminDashboardContent = ({ searchData }: AdminDashboardContentProps) => {
  return (
    <div className="flex gap-4 px-40 py-10">
      <ShopFilters />

      <AdminMallAndShops searchData={searchData} />
    </div>
  );
};

export default AdminDashboardContent;

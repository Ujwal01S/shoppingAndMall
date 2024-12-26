import axios from "axios";
import MallsAndShops from "../mallsAndShops";
import ShopFilters from "../shopFilters";

export const getAllMallData = async () => {
  const { data } = await axios.get("/api/mall");
  return data;
};

export const getAllShopData = async () => {
  const { data } = await axios.get("/api/shop");
  return data;
};

const HomepageContent = () => {
  return (
    <div className="flex gap-4 px-40 py-10">
      <ShopFilters />

      <MallsAndShops />
    </div>
  );
};

export default HomepageContent;

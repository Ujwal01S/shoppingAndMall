import { Grid2x2Plus } from "lucide-react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const ShopFilterLoader = () => {
  return (
    <div className="hidden mobile-xl:flex flex-col gap-3 min-w-[16%]">
      <p className="font-bold text-brand-text-primary text-xl">Shop Filters</p>
      <div className="flex gap-2">
        <Grid2x2Plus className="text-brand-text-customBlue" size={20} />
        <p className=" font-medium text-brand-text-tertiary cursor-pointer hover:text-brand-text-customBlue">
          All Categories
        </p>
      </div>
      <Skeleton count={6} height={20} width={200} />
    </div>
  );
};

export default ShopFilterLoader;

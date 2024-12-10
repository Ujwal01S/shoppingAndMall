import { Grid2x2Plus } from "lucide-react";
import { shop_filter_categories as shopFilterCategories } from "@/json_data/shop_filter_categories.json";
import Link from "next/link";

const ShopFilters = () => {
  return (
    <div className="flex flex-col gap-3 w-[21%]">
      <p className="font-bold text-brand-text-primary text-xl">Shop Filters</p>
      <div className="flex gap-2">
        <Grid2x2Plus className="text-brand-text-customBlue" size={20} />
        <p className=" font-medium text-brand-text-tertiary cursor-pointer hover:text-brand-text-customBlue">All Categories</p>
      </div>
      {shopFilterCategories.map((category, index) => (
        <div className="flex" key={index}>
        <Link href={category.link} className="hover:text-brand-text-customBlue font-medium text-brand-text-tertiary">
          {category.text}({category.amount})
        </Link>
      </div>
      ))}
    </div>
  );
};

export default ShopFilters;

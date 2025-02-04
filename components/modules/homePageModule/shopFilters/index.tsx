"use client";
import { Grid2x2Plus } from "lucide-react";
// import { shop_filter_categories as shopFilterCategories } from "@/json_data/shop_filter_categories.json";
import Link from "next/link";
// import { useSession } from "next-auth/react";
import ShopFilterLoader from "../../shared/loadingSkeleton/shopFilterLoader";
import { useContext } from "react";
import { UserRoleContext } from "@/store/userRoleContext";

export type CategoryType = {
  category: string;
  subCategory: string[];
  _id: string;
  malls: string[];
};

export type ShopFilterType = {
  shopFilterCategories: CategoryType[];
  isLoading: boolean;
};

const ShopFilters = ({ isLoading, shopFilterCategories }: ShopFilterType) => {
  // const { data: session } = useSession();

  const { ctxUserRole } = useContext(UserRoleContext);

  let route: string;
  if (ctxUserRole === "admin") {
    route = "/admin/home/category";
  } else {
    route = "/home/category";
  }

  if (isLoading) {
    return <ShopFilterLoader />;
  }
  return (
    <div className="hidden mobile-xl:flex flex-col gap-3 mr-2 w-[295px]">
      <p className="font-bold text-brand-text-primary text-xl">Shop Filters</p>
      <div className="flex gap-2">
        <Grid2x2Plus className="text-brand-text-customBlue" size={20} />
        <p className=" font-medium text-brand-text-tertiary cursor-pointer hover:text-brand-text-customBlue">
          All Categories
        </p>
      </div>
      {Array.isArray(shopFilterCategories) &&
        shopFilterCategories?.map((category: CategoryType) => (
          <div className="flex" key={category._id}>
            <Link
              href={`${route}/${category.category}`}
              className="hover:text-brand-text-customBlue font-medium text-brand-text-tertiary flex gap-2 min-w-[165px]"
            >
              {category.category} ({category.malls.length})
            </Link>
          </div>
        ))}
    </div>
  );
};

export default ShopFilters;

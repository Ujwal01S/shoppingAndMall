"use client";
import { Grid2x2Plus, X } from "lucide-react";

import Link from "next/link";
import React from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import { getAllCategory } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { ShopFilterType } from "../../homePageModule/shopFilters";
import { useSession } from "next-auth/react";

const MobileFilter = () => {
  const { data: filterCategories, isLoading } = useQuery({
    queryFn: () => getAllCategory(),
    queryKey: ["category"],
  });

  const { data: session } = useSession();

  let route: string;
  if (session?.user.role === "admin") {
    route = "/admin/home/category";
  } else {
    route = "/home/category";
  }

  if (isLoading) {
    return <p>Loading</p>;
  }

  const shopFilterCategories: ShopFilterType =
    filterCategories?.categories || [];
  return (
    <div className="p-3 w-full flex gap-2 items-center justify-between mobile-xl:hidden overflow-hidden flex-wrap">
      <Drawer direction="top">
        <DrawerTrigger>
          <span className="bg-white border-[1px] px-4 rounded-sm text-brand-text-footer flex gap-2 text-sm py-1.5 mt-0 w-[40%] min-w-[135px]">
            <Grid2x2Plus className="text-brand-text-customBlue" size={18} />
            All Category
          </span>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className="flex justify-between items-center">
            <DrawerTitle className="font-normal">
              Filter by Category?
            </DrawerTitle>
            <DrawerClose>
              <X>Cancel</X>
            </DrawerClose>
            <DrawerDescription className="sr-only">
              This action cannot be undone.
            </DrawerDescription>
          </DrawerHeader>

          {shopFilterCategories &&
            Array.isArray(shopFilterCategories) &&
            shopFilterCategories.map((category, index) => (
              <Link
                key={category._id}
                href={`${route}/${category.category}`}
                className={`px-4 py-2 text-sm overflow-hidden ${
                  shopFilterCategories.length - 1 === index
                    ? ""
                    : "border-b-[1px]"
                } ${index === 0 ? "border-t-[1px]" : ""} `}
              >
                {category.category}
                {`(${category.subCategory.length})`}
              </Link>
            ))}
        </DrawerContent>
      </Drawer>

      {Array.isArray(shopFilterCategories) &&
        shopFilterCategories.slice(0, 3).map((category) => (
          <React.Fragment key={category._id}>
            <Link
              href={`${route}/${category.category}`}
              className="bg-white rounded-sm  border-[1px] text-brand-text-footer text-sm py-1.5 w-[40%] min-w-[135px] px-5 relative"
            >
              {category.category.slice(0, 15) ?? null}..
              <span className="absolute flex items-center justify-center text-xs w-4 h-4 text-white bg-brand-text-footer rounded-full right-2 -top-2">
                {category.malls.length}
              </span>
            </Link>
          </React.Fragment>
        ))}
    </div>
  );
};

export default MobileFilter;

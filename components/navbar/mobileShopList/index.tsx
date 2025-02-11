"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronsDown } from "lucide-react";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllCategory } from "@/lib/api";
import { useSession } from "next-auth/react";
import { CategoryType, ShopCategoryType } from "../shopList";
import Link from "next/link";

const MobileShopList = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();

  const [categoryClicked, setCategoryClicked] = useState<string | null>(null);

  const handleCategoryCollapse = (category: string) => {
    if (categoryClicked === category) {
      setCategoryClicked(null);
    } else {
      setCategoryClicked(category);
    }
  };

  let route: string;
  if (session?.user.role === "admin") {
    route = "/admin/shops/category";
  } else {
    route = "/shops/category";
  }

  const { data: categoryData, isLoading } = useQuery({
    queryFn: () => getAllCategory(),
    queryKey: ["category"],
  });

  if (isLoading) {
    return <p className="font-bold">Shops</p>;
  }

  const shopCategory =
    Array.isArray(categoryData?.categories) &&
    categoryData?.categories.map((category: CategoryType) => ({
      text: category.category,
      link: category.category,
      subContent: category.subCategory,
      isNavContent: category.subCategory.length > 0 ? true : false,
    }));

  //no need to use double collapsible just nest two CollapsibleContent in single Collapsible so that you don't have to double click the chevaronUp to show next subContent

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-full space-y-2 "
    >
      <div className="flex items-center justify-between space-x-4">
        <Link
          href={session?.user.role === "admin" ? "/admin/shops" : "/shops"}
          className="font-bold"
        >
          Shops
        </Link>
        <CollapsibleTrigger asChild>
          <button>
            <ChevronsDown className="h-4 w-4" />
            <span className="sr-only">Toggle</span>
          </button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="space-y-3 flex flex-col text-brand-text-footer">
        {shopCategory &&
          shopCategory.map((category: ShopCategoryType) => (
            <React.Fragment key={category.text}>
              {category.isNavContent === false ? (
                <Link href={`${route}/${category.link}`}>{category.text}</Link>
              ) : (
                <div className="w-full space-y-2">
                  <div className="flex items-center justify-between space-x-4">
                    <Link href={`${route}/${category.link}`}>
                      {category.text}
                    </Link>
                    <button
                      onClick={() => handleCategoryCollapse(category.text)}
                    >
                      <ChevronsDown className="h-4 w-4" />
                      <span className="sr-only">Toggle</span>
                    </button>
                  </div>
                  {/* Only show subcategory content if this category is clicked */}
                  {categoryClicked === category.text && (
                    <CollapsibleContent className="bg-slate-200 space-y-2 mx-2 px-2 flex flex-col text-brand-text-footer">
                      {category?.subContent.map((sub, index) => (
                        <Link
                          href={`${route}/${category.text}/${sub}`}
                          key={index}
                        >
                          {sub}
                        </Link>
                      ))}
                    </CollapsibleContent>
                  )}
                </div>
              )}
            </React.Fragment>
          ))}
      </CollapsibleContent>
    </Collapsible>
  );
};

export default MobileShopList;

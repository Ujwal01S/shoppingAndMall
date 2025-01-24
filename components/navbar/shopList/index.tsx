"use client";
// import CategoryLoader from "@/components/modules/shared/loadingSkeleton/categoryLoader";
import {
  NavigationMenu,
  NavigationMenuContent,
  // NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

// import { shops_categories as shopCategories } from "@/json_data/shops_category.json";
import { getAllCategory } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useState } from "react";

type CategoryType = {
  category: string;
  subCategory: string[];
};

type ShopCategoryType = {
  text: string;
  link: string;
  subContent: string[];
  isNavContent: boolean;
};

const ShopList = () => {
  const { data: session } = useSession();
  const [hoveredCategory, setHoveredCategory] = useState<string>("");

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
    return (
      <div>
        <p className="text-base font-bold">Shops</p>
      </div>
    );
  }

  const handleMouseEnter = (category: string) => {
    setHoveredCategory(category);
  };

  // console.log(hoveredCategory);

  const shopCategory =
    Array.isArray(categoryData?.categories) &&
    categoryData?.categories.map((category: CategoryType) => ({
      text: category.category,
      link: category.category,
      subContent: category.subCategory,
      isNavContent: category.subCategory.length > 0 ? true : false,
    }));

  // console.log("categoryFromAPI:", shopCategory[0]);

  return (
    <NavigationMenu viewportClassName="left-[-150px] w-fit">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-base font-bold hover:none">
            <Link
              href={session?.user.role === "admin" ? "/admin/shops" : "/shops"}
            >
              Shops
            </Link>
          </NavigationMenuTrigger>
          <NavigationMenuContent className="flex flex-col p-5 gap-4 font-normal">
            {shopCategory &&
              shopCategory.map((category: ShopCategoryType) => (
                <React.Fragment key={category.text}>
                  {category.isNavContent === false ? (
                    <NavigationMenuLink
                      href={`${route}/${category.link}`}
                      className=" text-brand-text-primary min-w-[200px] hover:text-[#426CC0]"
                      key={category.text}
                    >
                      {category.text}
                    </NavigationMenuLink>
                  ) : (
                    <NavigationMenu orientation="vertical">
                      <NavigationMenuList>
                        <NavigationMenuItem>
                          <NavigationMenuTrigger
                            className="flex hover:none
                             text-brand-text-primary min-w-[200px] hover:text-[#426CC0] p-0"
                            onMouseEnter={() => handleMouseEnter(category.text)}
                          >
                            <Link
                              href={`${route}/${category.link}`}
                              className="w-full text-start"
                            >
                              {category.text}
                            </Link>
                            {/* <NavigationMenuIndicator className="rotate-45 text-brand-text-customBlue"></NavigationMenuIndicator> */}
                          </NavigationMenuTrigger>
                          <NavigationMenuContent className="min-w-48 flex flex-col gap-3 p-3">
                            {category?.subContent?.map((sub, index) => (
                              <NavigationMenuLink
                                href={`${route}/${hoveredCategory}/${sub}`}
                                key={index}
                                className="text-brand-text-primary min-w-[250px] hover:text-[#426CC0] cursor-pointer"
                              >
                                {sub}
                              </NavigationMenuLink>
                            ))}
                          </NavigationMenuContent>
                        </NavigationMenuItem>
                      </NavigationMenuList>
                    </NavigationMenu>
                  )}
                </React.Fragment>
              ))}
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default ShopList;

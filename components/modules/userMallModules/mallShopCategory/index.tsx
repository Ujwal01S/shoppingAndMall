"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Grid2x2Plus, X } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { shopCategories } from "@/json_data/shops_category.json";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";

type ShopMallCategory = {
  title: "mall" | "shop" | "category";
  handleCategoryChange: (value: string) => void;
  setCategory: React.Dispatch<React.SetStateAction<string>>;
  category: string | undefined;
  urlArry?: string[];
};

const ShopMallCategory = ({
  title,
  category,
  handleCategoryChange,
  setCategory,
  urlArry,
}: ShopMallCategory) => {
  const { data: session } = useSession();
  const router = useRouter();

  // console.log(urlArry);

  let route;
  if (session?.user.role === "admin") {
    route = "/admin/shops/category";
  } else {
    route = "/shops/category";
  }

  const handleRemoveCategory = () => {
    if (setCategory) {
      setCategory("");
    }
    if (session?.user.role === "admin") {
      router.push(`/admin/shops`);
    } else {
      router.push(`/shops`);
    }
  };

  const handleBreadCrumClick = () => {
    if (session?.user.role === "admin") {
      router.push(`/admin/shops/category/${urlArry ? urlArry[0] : undefined}`);
    } else {
      router.push(`/shops/category/${urlArry ? urlArry[0] : undefined}`);
    }
  };

  return (
    <div className="flex justify-between">
      <div className="flex flex-col gap-5">
        {urlArry ? (
          <div className="flex gap-2">
            <Breadcrumb>
              <BreadcrumbList>
                {urlArry.map((url, index) => (
                  <div key={index} className="flex items-center">
                    <BreadcrumbItem>
                      <BreadcrumbLink href="#">{url}</BreadcrumbLink>
                    </BreadcrumbItem>
                    {urlArry.length - 1 === index ? (
                      <></>
                    ) : (
                      <BreadcrumbSeparator />
                    )}
                  </div>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
            <X
              size={20}
              className="text-red-600"
              onClick={handleBreadCrumClick}
            />
          </div>
        ) : (
          <>
            {category && (
              <div className="flex gap-3 items-center">
                <span className="text-brand-text-primary">{category}</span>
                <X
                  size={20}
                  className="text-red-600"
                  onClick={handleRemoveCategory}
                />
              </div>
            )}
          </>
        )}
        <Select value={category} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-[280px] py-5 text-brand-text-customBlue">
            <div className="flex gap-3">
              <Grid2x2Plus size={20} />
              <p>Shop Categories</p>
            </div>
            {/* <SelectValue placeholder="" /> */}
          </SelectTrigger>
          <SelectContent>
            {shopCategories.map((category) => (
              <SelectItem key={category.value} value={category.text}>
                {category.content.length === 0 ? (
                  <>{category.text}</>
                ) : (
                  <>
                    <NavigationMenu orientation="vertical" className="">
                      <NavigationMenuList>
                        <NavigationMenuItem>
                          <NavigationMenuTrigger className="p-0">
                            {category.text}
                          </NavigationMenuTrigger>
                          <NavigationMenuContent className="flex flex-col min-w-[250px] gap-3">
                            {category.content.map((subCat) => (
                              <NavigationMenuLink
                                key={subCat.value}
                                href={`/${route}/something/${subCat.link}`}
                              >
                                {subCat.subContent}
                              </NavigationMenuLink>
                            ))}
                          </NavigationMenuContent>
                        </NavigationMenuItem>
                      </NavigationMenuList>
                    </NavigationMenu>
                  </>
                )}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {session?.user.role === "admin" && title === "mall" && (
        <Button
          variant="signin"
          className=" w-fit mt-2 rounded-none bg-brand-text-footer text-white py-5"
        >
          <Link href="/admin/newMall">Add New Mall</Link>
        </Button>
      )}
    </div>
  );
};

export default ShopMallCategory;

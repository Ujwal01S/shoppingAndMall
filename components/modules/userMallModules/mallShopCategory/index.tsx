"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Grid2x2Plus, X } from "lucide-react";

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
import React, { useState } from "react";

type ShopMallCategory = {
  title: "mall" | "shop" | "category";
  // handleCategoryChange: (value: string) => void;
  setCategory: React.Dispatch<React.SetStateAction<string>>;
  category: string | undefined;
  urlArry?: string[];
};

type ContentType = {
  subContent: string;
  value: string;
  link: string;
};

type ShopCategoryType = {
  text: string;
  value: string;
  link: string;
  content: ContentType[];
};

const ShopMallCategory = ({
  title,
  category,
  // handleCategoryChange,
  setCategory,
  urlArry,
}: ShopMallCategory) => {
  const { data: session } = useSession();
  const router = useRouter();

  const [hoveredCategory, setHoveredCategory] = useState<string>("");

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

  const handleMouseEnter = (cat: string) => {
    setHoveredCategory(cat);
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="flex hover:text-none max-w-44 text-brand-text-customBlue justify-between items-center"
            >
              <div className="flex gap-3 items-center">
                <Grid2x2Plus size={20} />
                <p>Shop Categories</p>
              </div>
              <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="flex flex-col gap-2 p-3 ">
            {Array.isArray(shopCategories) &&
              shopCategories.map(
                (category: ShopCategoryType, index: number) => (
                  <React.Fragment key={index}>
                    {category.content.length > 0 ? (
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                          <Link
                            className="w-full"
                            href={`${route}/${category.text}`}
                            onMouseEnter={() => handleMouseEnter(category.text)}
                          >
                            {category.text}
                          </Link>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuSubContent className="min-w-48">
                          {category.content.map((subContent) => (
                            <DropdownMenuItem key={subContent.value}>
                              <Link
                                href={`${route}/${hoveredCategory}/${subContent.subContent}`}
                              >
                                {subContent.subContent}
                              </Link>
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuSubContent>
                      </DropdownMenuSub>
                    ) : (
                      <DropdownMenuItem
                        onClick={() => setCategory(category.text)}
                      >
                        <Link href={`${route}/${category.text}`}>
                          {" "}
                          {category.text}{" "}
                        </Link>
                      </DropdownMenuItem>
                    )}
                  </React.Fragment>
                )
              )}
          </DropdownMenuContent>
        </DropdownMenu>
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

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

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import { shopCategories } from "@/json_data/shops_category.json";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllCategory } from "@/lib/api";
import { CategoryType } from "../../homePageModule/shopFilters";

type ShopMallCategory = {
  title?: "malls" | "shops";
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
  const [clickedCategory, setClickedCategory] = useState<string | null>(null);

  let route;
  if (session?.user.role === "admin") {
    route = `/admin/${title}/category`;
  } else {
    route = `/${title}/category`;
  }

  const { data: shopFilterCategoriesData } = useQuery({
    queryFn: () => getAllCategory(),
    queryKey: ["category"],
  });

  const shopFilterCategories: CategoryType[] =
    shopFilterCategoriesData?.categories;

  const handleRemoveCategory = () => {
    if (setCategory) {
      setCategory("");
    }
    if (session?.user.role === "admin") {
      router.push(`/admin/${title}`);
    } else {
      router.push(`/${title}`);
    }
  };

  // console.log({ title });

  // console.log(`/admin/${title}/category/${urlArry ? urlArry[0] : undefined}`);

  const handleBreadCrumClick = () => {
    if (session?.user.role === "admin") {
      router.push(
        `/admin/${title}/category/${urlArry ? urlArry[0] : undefined}`
      );
    } else {
      router.push(`/${title}/category/${urlArry ? urlArry[0] : undefined}`);
    }
  };

  const handleMouseEnter = (cat: string) => {
    setHoveredCategory(cat);
  };

  const handleCategoryClick = (category: string) => {
    if (category === clickedCategory) {
      setClickedCategory(null);
    } else {
      setClickedCategory(category);
    }
  };

  return (
    <div className="flex justify-between items-center">
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
              className="hidden tablet-md:flex hover:text-none max-w-44 text-brand-text-customBlue justify-between items-center"
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

        <Drawer direction="top">
          <DrawerTrigger>
            <span className="bg-white tablet-md:hidden border-[1px] px-4 rounded-sm text-brand-text-footer flex gap-2 text-sm py-1.5 mt-0 w-40">
              <Grid2x2Plus className="text-brand-text-customBlue" size={18} />
              All Category
            </span>
          </DrawerTrigger>
          <DrawerContent className="overflow-y-auto max-h-[50%]">
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
              shopFilterCategories.map((category, index) => (
                <div className="w-full " key={category._id}>
                  {category.subCategory.length > 0 ? (
                    <>
                      <button
                        onClick={() => handleCategoryClick(category.category)}
                        className={`px-4 py-2 w-full text-start text-sm overflow-hidden ${
                          shopFilterCategories.length - 1 === index
                            ? ""
                            : "border-b-[1px]"
                        } ${index === 0 ? "border-t-[1px]" : ""} `}
                      >
                        {category.category}
                        {`(${category.subCategory.length})`}
                      </button>
                      {clickedCategory === category.category &&
                        category.subCategory.map((subCat) => (
                          <div
                            className="bg-slate-200 flex flex-col gap-1 px-4"
                            key={subCat}
                          >
                            <Link
                              href={`${route}/${category.category}/${subCat}`}
                              className={`px-4 py-1 w-full mb-2 text-sm overflow-hidden `}
                            >
                              {subCat}
                            </Link>
                          </div>
                        ))}
                    </>
                  ) : (
                    <div
                      className={`px-4 w-full py-2 ${
                        shopFilterCategories.length - 1 === index
                          ? ""
                          : "border-b-[1px]"
                      } ${index === 0 ? "border-t-[1px]" : ""}`}
                    >
                      <Link
                        href={`${route}/${category.category}`}
                        className={` text-sm  overflow-hidden  `}
                      >
                        {category.category}
                        {`(${category.subCategory.length})`}
                      </Link>
                    </div>
                  )}
                </div>
              ))}
          </DrawerContent>
        </Drawer>
      </div>
      {session?.user.role === "admin" && title === "malls" && (
        <>
          <Button
            variant="signin"
            className=" w-fit mt-2 hidden mobile-xl:flex rounded-none bg-brand-text-footer text-white py-5"
          >
            <Link href="/admin/newMall">Add New Mall</Link>
          </Button>

          <Button
            variant="signin"
            className=" w-fit flex mobile-xl:hidden rounded-none bg-brand-text-footer text-white py-2"
          >
            <Link href="/admin/newMall">+</Link>
          </Button>
        </>
      )}
    </div>
  );
};

export default ShopMallCategory;

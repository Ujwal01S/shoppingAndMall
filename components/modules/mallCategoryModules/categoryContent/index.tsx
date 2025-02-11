"use client";
import React, { useEffect, useState } from "react";
import ShopMallCategory from "../../userMallModules/mallShopCategory";
import { useQuery } from "@tanstack/react-query";
import { getShopAndMallWithCategory } from "@/lib/api";
import MallCard from "../../shared/mallCard";
import MallShopLoader from "../../shared/loadingSkeleton/mallShopLoader";

export interface MallProps {
  _id: string;
  name: string;
  // location: string;
  imageUrl: string;
  openTime: string;
  closeTime: string;
  address: string;
  phone: string;
  //   image?: string[] | undefined;
  mallName?: string;
}

type CategoryContentType = {
  initialCategory: string;
  route: string;
};

const CategoryContent = ({ initialCategory, route }: CategoryContentType) => {
  const [category, setCategory] = useState<string>("");
  // console.log(category);
  // const handleCategoryChange = (value: string) => {
  //   setCategory(value);
  // };

  useEffect(() => {
    if (initialCategory) {
      setCategory(initialCategory);
    }
  }, [initialCategory]);

  const { data: specificMall, isLoading } = useQuery({
    queryFn: () => getShopAndMallWithCategory(category as string),
    queryKey: ["shop and mall", category],
    enabled: !!category,
  });

  // console.log(specificMall);

  if (isLoading) {
    return <MallShopLoader title="Mall Shops" />;
  }
  return (
    <>
      <div className="w-full px-2 tablet-md:w-[70%] flex flex-col gap-3">
        <ShopMallCategory
          title={route === "malls" || route === "shops" ? route : undefined}
          category={category}
          // handleCategoryChange={handleCategoryChange}
          setCategory={setCategory}
        />
      </div>

      <div className="flex flex-col gap-4 w-full px-1 tablet-md:w-[70%]">
        <p className="text-2xl font-bold text-brand-text-secondary">Malls</p>

        {specificMall?.mallData.length > 0 ? (
          <div className="grid grid-cols-1 mobile-lg:grid-cols-2 desktop-md:grid-cols-3 gap-6 items-center justify-center">
            {specificMall.mallData
              .filter((mall: MallProps) => mall && mall.imageUrl)
              .map((mall: MallProps) => (
                <MallCard key={mall._id} content={mall} title="category" />
              ))}
          </div>
        ) : (
          <p>No mall available....</p>
        )}
      </div>
    </>
  );
};

export default CategoryContent;

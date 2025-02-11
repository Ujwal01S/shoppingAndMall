"use client";
import React, { useEffect, useState } from "react";
import ShopMallCategory from "../userMallModules/mallShopCategory";
import { getShopAndMallWithCategory } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { ShopsTypes } from "@/app/api/category/[name]/route";
import { MallProps } from "../mallCategoryModules/categoryContent";
import MallCard from "../shared/mallCard";
import MallShopLoader from "../shared/loadingSkeleton/mallShopLoader";

type ShopCategoryContentType = {
  initialCategory: string;
  route: string;
};

const ShopCategoryContent = ({
  initialCategory,
  route,
}: ShopCategoryContentType) => {
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

  const { data: specificShop, isLoading } = useQuery({
    queryFn: () => getShopAndMallWithCategory(category as string),
    queryKey: ["shop and mall", category],
    enabled: !!category,
  });

  // console.log(specificShop);

  const newShopData = specificShop?.shops.map((shop: ShopsTypes) => ({
    name: shop.name,
    openTime: shop.openTime,
    closeTime: shop.closeTime,
    address: shop.mallName,
    phone: shop.phone,
    imageUrl: shop.image ? shop.image[0] : null,
  }));

  if (isLoading) {
    return <MallShopLoader title="Shops" />;
  }
  return (
    <>
      <div className="w-full px-2 tablet-md:w-[70%] flex flex-col gap-4">
        <ShopMallCategory
          title={route === "malls" || route === "shops" ? route : undefined}
          category={category}
          // handleCategoryChange={handleCategoryChange}
          setCategory={setCategory}
        />
      </div>

      <div className="flex flex-col gap-4 w-full px-2 tablet-md:w-[70%]">
        <p className="text-2xl font-bold text-brand-text-secondary">Shops</p>

        <div className="grid grid-cols-1 mobile-lg:grid-cols-2 desktop-md:grid-cols-3 gap-6 items-center justify-center">
          {Array.isArray(newShopData) && newShopData.length > 0 ? (
            newShopData
              ?.filter((mall: MallProps) => mall && mall.imageUrl)
              .map((mall: MallProps) => (
                <MallCard
                  content={mall}
                  title="shopCategory"
                  key={mall._id || `${mall.name}-${mall.address}`}
                />
              ))
          ) : (
            <p className="text-brand-text-secondary">No shops available...</p>
          )}
        </div>
      </div>
    </>
  );
};

export default ShopCategoryContent;

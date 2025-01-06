"use client";
import React, { useEffect, useState } from "react";
import ShopMallCategory from "../userMallModules/mallShopCategory";
import { getShopAndMallWithCategory } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { ShopsTypes } from "@/app/api/category/[name]/route";
import { MallProps } from "../mallCategoryModules/categoryContent";
import MallCard from "../shared/mallCard";

type ShopCategoryContentType = {
  initialCategory: string;
};

const ShopCategoryContent = ({ initialCategory }: ShopCategoryContentType) => {
  const [category, setCategory] = useState<string>("");
  console.log(category);
  const handleCategoryChange = (value: string) => {
    setCategory(value);
  };

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
    return (
      <div className="flex items-center justify-center">
        <p className="text-green-500">Shop Data is loading..</p>
      </div>
    );
  }
  return (
    <>
      <div className="w-[70%] flex flex-col gap-3">
        <ShopMallCategory
          title="category"
          category={category}
          handleCategoryChange={handleCategoryChange}
          setCategory={setCategory}
        />
      </div>

      <div className="flex flex-col gap-4 w-[70%]">
        <p className="text-2xl font-bold text-brand-text-secondary">Shops</p>

        <div className="grid grid-cols-3 gap-6">
          {newShopData?.map((mall: MallProps, index: number) => (
            <React.Fragment key={index}>
              {mall && mall.imageUrl && (
                <MallCard content={mall} title="shopCategory" key={index} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </>
  );
};

export default ShopCategoryContent;

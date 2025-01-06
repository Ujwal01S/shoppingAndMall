"use client";
import React, { useEffect, useState } from "react";
import ShopMallCategory from "../../userMallModules/mallShopCategory";
import { useQuery } from "@tanstack/react-query";
import { getShopAndMallWithCategory } from "@/lib/api";
import MallCard from "../../shared/mallCard";

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
};

const CategoryContent = ({ initialCategory }: CategoryContentType) => {
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

  const { data: specificMall, isLoading } = useQuery({
    queryFn: () => getShopAndMallWithCategory(category as string),
    queryKey: ["shop and mall", category],
    enabled: !!category,
  });

  //   console.log(specificMall);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <p>Mall data is loading..</p>
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
        <p className="text-2xl font-bold text-brand-text-secondary">Malls</p>

        <div className="grid grid-cols-3 gap-6">
          {specificMall?.mallData?.map((mall: MallProps, index: number) => (
            <React.Fragment key={index}>
              {mall && mall.imageUrl && (
                <MallCard content={mall} title="category" key={index} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </>
  );
};

export default CategoryContent;

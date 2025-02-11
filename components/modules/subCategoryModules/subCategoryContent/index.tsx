"use client";
// import { useRouter } from "next/navigation";
import ShopMallCategory from "../../userMallModules/mallShopCategory";
import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getSubCategory } from "@/lib/api";
import { ContentProps } from "@/components/carousel";
import MallCard from "../../shared/mallCard";
import { ShopsTypes } from "@/app/api/category/[name]/route";
import MallShopLoader from "../../shared/loadingSkeleton/mallShopLoader";

interface SubCategoryContextProps {
  url: string;
  urlArry: string[];
  route: string;
}

const SubCategoryContext = ({
  urlArry,
  url,
  route,
}: SubCategoryContextProps) => {
  // const router = useRouter();
  const [category, setCategory] = useState<string>("");

  const [formattedShops, setFormattedShops] = useState<ContentProps[]>([]);

  // as a params leko data lai queryFn( yeta halnu pardaina )
  const { data: subCategoryShops, isLoading } = useQuery({
    queryFn: () => getSubCategory(url),
    queryKey: ["subCategory"],
  });

  useEffect(() => {
    if (!subCategoryShops) return;

    const formatted = subCategoryShops.map((shop: ShopsTypes) => ({
      _id: shop._id,
      name: shop.name,
      openTime: shop.openTime,
      closeTime: shop.closeTime,
      address: shop.mallName,
      phone: shop.phone,
      imageUrl: shop.image?.[0] ?? undefined,
    }));
    setFormattedShops(formatted);
  }, [subCategoryShops]);

  if (isLoading) {
    return <MallShopLoader title="Shops" />;
  }

  // console.log(subCategoryShops);

  // const handleCategoryChange = (value: string) => {
  //   setCategory(value);
  //   router.push(`/admin/shops/category/${value}`);
  // };

  return (
    <div className="w-full px-2 tablet-md:w-[70%] flex flex-col gap-3 container">
      <ShopMallCategory
        title={route === "malls" || route === "shops" ? route : undefined}
        category={category}
        // handleCategoryChange={handleCategoryChange}
        setCategory={setCategory}
        urlArry={urlArry}
      />

      <div className="flex flex-col gap-4">
        <p className="text-2xl font-bold text-brand-text-secondary">Shops</p>

        <div className="grid tablet-sm:grid-cols-2 desktop-md:grid-cols-3 gap-6">
          {formattedShops.length > 0 ? (
            formattedShops.map((shop) => (
              <MallCard key={shop._id} content={shop} title="shop" />
            ))
          ) : (
            <p className="text-brand-text-secondary">No shops found...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubCategoryContext;

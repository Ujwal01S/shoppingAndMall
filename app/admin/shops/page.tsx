"use client";
import ShopContent from "@/components/modules/shopModules";
import MallSearch from "@/components/modules/userMallModules/mallSearch";
import ShopMallCategory from "@/components/modules/userMallModules/mallShopCategory";
import { useRouter } from "next/navigation";

import { useState } from "react";

const ShopPage = () => {
  const router = useRouter();
  const [category, setCategory] = useState<string>("");
  const handleCategoryChange = (value: string) => {
    setCategory(value);
    router.push(`/admin/shops/category/${value}`);
  };
  return (
    <div className="w-full flex flex-col items-center gap-14 mb-8 mt-4">
      <MallSearch />
      <div className="w-[70%] flex flex-col gap-3">
        <ShopMallCategory
          title="shop"
          category={category}
          handleCategoryChange={handleCategoryChange}
          setCategory={setCategory}
        />
        <ShopContent />
      </div>
    </div>
  );
};

export default ShopPage;

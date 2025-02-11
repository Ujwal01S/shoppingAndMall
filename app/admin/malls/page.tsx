"use client";
import MallsComponent from "@/components/modules/userMallModules/mall";
import MallSearch from "@/components/modules/userMallModules/mallSearch";
import ShopMallCategory from "@/components/modules/userMallModules/mallShopCategory";
import { useState } from "react";

const AdminMall = () => {
  const [category, setCategory] = useState<string>("");

  const [searchData, setSearchData] = useState<string>("");
  return (
    <div className="w-full flex flex-col items-center gap-14 pb-8 mt-4">
      <MallSearch setSearchData={setSearchData} title="mall" />
      <div className="w-full px-2 tablet-md:w-[70%] flex flex-col gap-3 container tablet-md:px-4">
        <ShopMallCategory
          title="malls"
          category={category}
          // handleCategoryChange={handleCategoryChange}
          setCategory={setCategory}
        />

        {/* mall component below */}

        <MallsComponent searchData={searchData} />
      </div>
    </div>
  );
};

export default AdminMall;

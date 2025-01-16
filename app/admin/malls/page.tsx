"use client";
import MallsComponent from "@/components/modules/userMallModules/mall";
import MallSearch from "@/components/modules/userMallModules/mallSearch";
import ShopMallCategory from "@/components/modules/userMallModules/mallShopCategory";
import { useRouter } from "next/navigation";
import { useState } from "react";

const AdminMall = () => {
  const router = useRouter();
  const [category, setCategory] = useState<string>("");

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    // console.log("clicked from malls");
    router.push(`/admin/malls/category/${value}`);
  };

  const [searchData, setSearchData] = useState<string>("");
  return (
    <div className="w-full flex flex-col items-center gap-14 mb-8 mt-4">
      <MallSearch setSearchData={setSearchData} title="mall" />
      <div className="w-[70%] flex flex-col gap-3 container">
        <ShopMallCategory
          title="mall"
          category={category}
          handleCategoryChange={handleCategoryChange}
          setCategory={setCategory}
        />

        {/* mall component below */}

        <MallsComponent searchData={searchData} />
      </div>
    </div>
  );
};

export default AdminMall;

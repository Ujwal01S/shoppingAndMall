"use client";
import MallsComponent from "@/components/modules/userMallModules/mall";
import MallSearch from "@/components/modules/userMallModules/mallSearch";
import ShopMallCategory from "@/components/modules/userMallModules/mallShopCategory";
// import { useRouter } from "next/navigation";
import { useState } from "react";

const MallPage = () => {
  // const router = useRouter();
  const [category, setCategory] = useState<string>("");
  const [searchData, setSearchData] = useState<string>("");
  // const handleCategoryChange = (value: string) => {
  //   setCategory(value);
  //   // console.log("clicked from malls");
  //   router.push(`/malls/category/${value}`);
  // };
  return (
    <div className="w-full flex flex-col items-center gap-14 mb-8 mt-4">
      <MallSearch setSearchData={setSearchData} title="mall" />
      <div className="w-full px-2 tablet-md:w-[70%] flex flex-col gap-3">
        <ShopMallCategory
          title="mall"
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

export default MallPage;

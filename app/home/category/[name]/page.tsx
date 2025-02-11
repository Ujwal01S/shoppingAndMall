"use client";
import AfterFilterCategory from "@/components/modules/categoryPageModules/afterFilter";
import CategoryFilteredContent from "@/components/modules/categoryPageModules/categoryContent";
import SearchBar from "@/components/modules/homePageModule/search";
import MobileFilter from "@/components/modules/shared/mobileServerShopFilter";
import { useParams } from "next/navigation";
import { useState } from "react";

const UserCategoryPage = () => {
  const params = useParams();
  const name = (params?.name as string) || "";
  const [searchData, setSearchData] = useState<string>("");
  return (
    <div className="flex  flex-col gap-4 items-center mt-20 w-full relative">
      <div className=" flex flex-col h-96 w-full">
        <div className="inset-0 bg-cover bg-center h-[120%] z-[-1] bg-homePageImage">
          <div className="flex flex-col z-10 items-center justify-center h-full">
            <p className="text-4xl font-bold text-white text-center">
              Search Shops and Malls
            </p>

            <p className="text-2xl font-semibold text-white">100+ shops</p>
          </div>
        </div>
      </div>
      <SearchBar setSearch={setSearchData} />
      <div className="w-full px-2 tablet-md:w-[85%] mobile-xl:flex gap-4 tablet-md:px-4 tablet-lg:pl-36 py-10">
        <AfterFilterCategory name={name} />

        <MobileFilter />

        <CategoryFilteredContent name={name} searchData={searchData} />
      </div>
    </div>
  );
};

export default UserCategoryPage;

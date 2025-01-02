"use client";
import CarouselCard from "@/components/carousel";
import Link from "next/link";

// import { list_of_mall as listOfMall } from "@/json_data/list_of_mall.json";
// import { list_of_shop as listOfShop } from "@/json_data/list_of_shop.json";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { getAllMallData } from "..";
import { getAllShopData } from "../../homePageModule/homepageContent";
import { searchMall } from "@/lib/api";

interface AdminMallAndShopsProps {
  searchData: string | null;
}

const AdminMallAndShops = ({ searchData }: AdminMallAndShopsProps) => {
  const { data: mallData, isLoading: mallIsLoading } = useQuery({
    queryFn: () => getAllMallData(),
    queryKey: ["mall"],
  });

  const { data: shopData, isLoading: shopIsLoading } = useQuery({
    queryFn: () => getAllShopData(),
    queryKey: ["shop"],
  });

  const { data: searchedMallData, isLoading: mallSearchIsLoading } = useQuery({
    queryFn: () => searchMall(searchData as string),
    queryKey: ["mall", searchData],
    enabled: !!searchData, // Only run the query if searchData is not null
  });

  if (mallIsLoading || shopIsLoading || mallSearchIsLoading) {
    return (
      <div className="w-full flex items-center justify-center">
        <p className="text-green-500">Mall or Shop Data Is Loading...</p>
      </div>
    );
  }

  // console.log(searchData);

  return (
    <div className="flex flex-col gap-6 w-full px-6">
      <Button
        variant="signin"
        className=" w-fit mt-2 rounded-none bg-brand-text-footer text-white py-5"
      >
        <Link href="/admin/newMall">Add New Mall</Link>
      </Button>
      <div className="flex justify-between">
        <p className="font-bold text-brand-text-primary text-xl">Malls</p>
        <Link href="#" className="font-bold text-brand-text-customBlue text-lg">
          View all
        </Link>
      </div>

      <CarouselCard content={searchData ? searchedMallData : mallData} />

      <div className="flex justify-between">
        <p className="font-bold text-brand-text-primary text-xl">Shops</p>
        <Link href="#" className="font-bold text-brand-text-customBlue text-lg">
          View all
        </Link>
      </div>

      <CarouselCard content={shopData} />
    </div>
  );
};

export default AdminMallAndShops;

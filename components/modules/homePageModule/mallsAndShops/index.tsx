"use client";
// import { list_of_mall as listOfMall } from "@/json_data/list_of_mall.json";
// import { list_of_shop as listOfShop } from "@/json_data/list_of_shop.json";
import CarouselCard from "@/components/carousel";
import Link from "next/link";
import { getAllMallData, getAllShopData } from "../homepageContent";
import { useQuery } from "@tanstack/react-query";

const MallsAndShops = () => {
  const { data: mallData, isLoading: mallIsLoading } = useQuery({
    queryFn: () => getAllMallData(),
    queryKey: ["mall"],
  });

  const { data: shopData, isLoading: shopIsLoading } = useQuery({
    queryFn: () => getAllShopData(),
    queryKey: ["shop"],
  });

  // if isLoading is not used than carousel component will load before api is able to fetch data
  if (mallIsLoading || shopIsLoading) {
    return (
      <div className="w-full flex items-center justify-center">
        <p className="text-green-500">Mall or Shop Data Is Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full px-6">
      <div className="flex justify-between">
        <p className="font-bold text-brand-text-primary text-xl">Malls</p>
        <Link href="#" className="font-bold text-brand-text-customBlue text-lg">
          View all
        </Link>
      </div>

      <CarouselCard content={mallData} />

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

export default MallsAndShops;

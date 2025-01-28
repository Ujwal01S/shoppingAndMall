"use client";
// import { list_of_mall as listOfMall } from "@/json_data/list_of_mall.json";
// import { list_of_shop as listOfShop } from "@/json_data/list_of_shop.json";
import CarouselCard from "@/components/carousel";
import Link from "next/link";
import { getAllMallData, getAllShopData } from "../homepageContent";
import { useQuery } from "@tanstack/react-query";
import { searchMall } from "@/lib/api";
import LoadingCarousel from "../../shared/loadingSkeleton/loadingCarousel";
import { ShopTypes } from "@/app/admin/malls/[id]/page";

interface MallsAndShopsProps {
  searchData: string | null;
}

const MallsAndShops = ({ searchData }: MallsAndShopsProps) => {
  const { data: mallData, isLoading: mallIsLoading } = useQuery({
    queryFn: () => getAllMallData(),
    queryKey: ["mall"],
  });

  const { data: shopData, isLoading: shopIsLoading } = useQuery({
    queryFn: () => getAllShopData(),
    queryKey: ["shop"],
  });

  const { data: searchedMallData } = useQuery({
    queryFn: () => searchMall(searchData as string),
    queryKey: ["mall", searchData],
    enabled: !!searchData, // Only run the query if searchData is not null
  });

  // if isLoading is not used than carousel component will load before api is able to fetch data
  if (mallIsLoading || shopIsLoading) {
    return <LoadingCarousel />;
  }

  let mall;
  if (Array.isArray(searchedMallData) && searchedMallData.length > 0) {
    mall = searchedMallData.map((data) => {
      return {
        address: data.address,
        _id: data._id,
        closeTime: data.closeTime,
        openTime: data.openTime,
        phone: data.phone,
        imageUrl: data.imageUrl,
        level: data.level,
        name: data.name,
      };
    });
  }
  let shops;
  if (Array.isArray(searchedMallData) && searchedMallData.length > 0) {
    shops = searchedMallData
      .map((data) => {
        if (Array.isArray(data.shops) && data.shops.length > 0) {
          return data.shops.map((data: ShopTypes) => {
            return {
              _id: data._id,
              closeTime: data.closeTime,
              openTime: data.openTime,
              phone: data.phone,
              image: data.image,
              mallName: data.mallName,
              name: data.name,
            };
          });
        }
        return [];
      })
      .flat(); //.flat() is used to change [[{}]] formate into [{}]
  }

  // console.log({ mall });

  if (searchData && !mall) {
    return (
      <div className="flex flex-col gap-6 w-full px-3 mobile-xl:px-6">
        <p className="font-bold text-brand-text-secondary text-xl">Malls</p>
        <p className="text-brand-text-secondary font-semibold">
          No Record Yet!!
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full px-6">
      <div className="flex justify-between">
        <p className="font-bold text-brand-text-primary text-xl">Malls</p>
        <Link
          href="/malls"
          className="font-bold text-brand-text-customBlue text-lg"
        >
          View all
        </Link>
      </div>

      <CarouselCard content={searchData ? mall : mallData} />

      <div className="flex justify-between">
        <p className="font-bold text-brand-text-primary text-xl">Shops</p>
        <Link
          href="/shops"
          className="font-bold text-brand-text-customBlue text-lg"
        >
          View all
        </Link>
      </div>

      <CarouselCard content={searchData ? shops : shopData} />
    </div>
  );
};

export default MallsAndShops;

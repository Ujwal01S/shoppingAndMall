"use client";
// import { list_of_mall as listOfMall } from "@/json_data/list_of_mall.json";
// import { list_of_shop as listOfShop } from "@/json_data/list_of_shop.json";
import CarouselCard from "@/components/carousel";
import Link from "next/link";
import { getAllMallData, getAllShopData } from "../homepageContent";
import { useQuery } from "@tanstack/react-query";
import { searchMall } from "@/lib/api";
import LoadingCarousel from "../../shared/loadingSkeleton/loadingCarousel";

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

  const { data: searchedMallData, isLoading: mallSearchIsLoading } = useQuery({
    queryFn: () => searchMall(searchData as string),
    queryKey: ["mall", searchData],
    enabled: !!searchData, // Only run the query if searchData is not null
  });

  // if isLoading is not used than carousel component will load before api is able to fetch data
  if (mallIsLoading || shopIsLoading || mallSearchIsLoading) {
    return <LoadingCarousel />;
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

      <CarouselCard content={searchData ? searchedMallData : mallData} />

      <div className="flex justify-between">
        <p className="font-bold text-brand-text-primary text-xl">Shops</p>
        <Link
          href="/shops"
          className="font-bold text-brand-text-customBlue text-lg"
        >
          View all
        </Link>
      </div>

      <CarouselCard content={shopData} />
    </div>
  );
};

export default MallsAndShops;

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
import { useSession } from "next-auth/react";
import LoadingCarousel from "../../shared/loadingSkeleton/loadingCarousel";

interface AdminMallAndShopsProps {
  searchData: string;
  // role: string;
}

const AdminMallAndShops = ({ searchData }: AdminMallAndShopsProps) => {
  const { data: session } = useSession();
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

  if (mallIsLoading || shopIsLoading) {
    return <LoadingCarousel />;
  }

  // console.log(searchData);

  return (
    <div className="flex flex-col gap-6 w-full px-3 mobile-xl:px-6">
      <Button
        variant="signin"
        className=" mobile-xl:w-fit mt-2 rounded-none bg-brand-text-footer text-white py-5"
        asChild
      >
        <Link href="/admin/newMall">Add New Mall</Link>
      </Button>
      <div className="flex justify-between">
        <p className="font-bold text-brand-text-primary text-xl">Malls</p>
        <Link
          href={session?.user.role === "admin" ? "/admin/malls" : "/malls"}
          className="font-bold text-brand-text-customBlue text-lg"
        >
          View all
        </Link>
      </div>

      <CarouselCard
        content={searchData ? searchedMallData : mallData}
        // role={role}
      />

      <div className="flex justify-between">
        <p className="font-bold text-brand-text-primary text-xl">Shops</p>
        <Link
          href={session?.user.role === "admin" ? "/admin/shops" : "/shops"}
          className="font-bold text-brand-text-customBlue text-lg"
        >
          View all
        </Link>
      </div>

      <CarouselCard
        content={shopData}
        //  role={role}
      />
    </div>
  );
};

export default AdminMallAndShops;

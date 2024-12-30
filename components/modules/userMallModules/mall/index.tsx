"use client";
import { useQuery } from "@tanstack/react-query";
import MallCard from "../../shared/mallCard";
// import { list_of_mall as listOfMall } from "@/json_data/list_of_mall.json";
import { getAllMallData } from "../../homePageModule/homepageContent";
import { ContentProps } from "@/components/carousel";

const MallsComponent = () => {
  const { data: mallData, isLoading } = useQuery({
    queryFn: () => getAllMallData(),
    queryKey: ["mall"],
  });
  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <p className="text-green-500">Mall Data is Loading....</p>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-4">
      <p className="text-2xl font-bold text-brand-text-secondary">Malls</p>

      <div className="grid grid-cols-3 gap-6">
        {Array.isArray(mallData) &&
          mallData.map((mall: ContentProps) => (
            <MallCard content={mall} key={mall.name} title="mall" />
          ))}
      </div>
    </div>
  );
};

export default MallsComponent;

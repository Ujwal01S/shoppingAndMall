"use client";
import { useQuery } from "@tanstack/react-query";
import MallCard from "../../shared/mallCard";
import { getAllMallData } from "../../homePageModule/homepageContent";
import { ContentProps } from "@/components/carousel";
import MallShopLoader from "../../shared/loadingSkeleton/mallShopLoader";
import { searchMall } from "@/lib/api";

interface MallsComponentProps {
  searchData: string;
}

const MallsComponent = ({ searchData }: MallsComponentProps) => {
  const { data: mallData, isLoading } = useQuery({
    queryFn: () => getAllMallData(),
    queryKey: ["mall"],
  });

  const { data: searchedMallData } = useQuery({
    queryFn: () => searchMall(searchData as string),
    queryKey: ["mall", searchData],
    enabled: !!searchData, // Only run the query if searchData is not null
  });

  if (isLoading) {
    return <MallShopLoader />;
  }
  return (
    <div className="flex flex-col gap-4">
      <p className="text-2xl font-bold text-brand-text-secondary">Malls</p>

      <div className="grid grid-cols-1 mobile-lg:grid-cols-2 desktop-md:grid-cols-3 gap-6 items-center justify-center">
        {searchData ? (
          <>
            {Array.isArray(searchedMallData) &&
              searchedMallData.map((mall: ContentProps) => (
                <MallCard content={mall} key={mall._id} title="mall" />
              ))}
          </>
        ) : (
          <>
            {Array.isArray(mallData) &&
              mallData.map((mall: ContentProps) => (
                <MallCard content={mall} key={mall._id} title="mall" />
              ))}
          </>
        )}
        {/* {Array.isArray(mallData) &&
          mallData.map((mall: ContentProps) => (
            <MallCard content={mall} key={mall.name} title="mall" />
          ))} */}
      </div>
    </div>
  );
};

export default MallsComponent;

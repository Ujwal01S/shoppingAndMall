"use client";
import { MallTypes, ShopsTypes } from "@/app/api/category/[name]/route";
import CarouselContentCard from "../../shared/carouselCard";
import { Separator } from "@radix-ui/react-separator";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import CategoryLoader from "../../shared/loadingSkeleton/categoryLoader";
import { useQuery } from "@tanstack/react-query";
import { getSubCategoryWithMall } from "@/lib/api";
import Image from "next/image";

type CategoryFilteredContentType = {
  name: string;
};

const SubCategoryContent = ({ name }: CategoryFilteredContentType) => {
  const { data, isLoading } = useQuery({
    queryFn: () => getSubCategoryWithMall(name),
    queryKey: ["shop and mall"],
  });

  //   console.log(data);

  // console.log(data);

  const router = useRouter();

  if (isLoading) {
    return <CategoryLoader />;
  }
  return (
    <>
      {data?.mallData.length !== 0 && data.shops !== 0 ? (
        <div className="flex flex-col gap-6 w-full px-6 mt-10">
          <p className="font-bold text-brand-text-primary text-xl">Malls</p>

          <div className="grid grid-cols-1 tablet-md:grid-cols-2 desktop-md:grid-cols-2 gap-6">
            {data?.mallData.map((mall: MallTypes) => (
              <Card
                className="relative max-w-[350px]"
                key={mall._id}
                onClick={() => router.push(`/malls/${mall?._id}`)}
              >
                <div className="rounded-md shadow-md flex flex-col gap-2">
                  <div className="overflow-hidden">
                    {mall?.imageUrl && (
                      <Image
                        src={mall?.imageUrl}
                        alt="mall_logo"
                        className="h-[200px] w-full rounded-md transition-transform duration-300 ease-in-out transform hover:scale-110"
                        width={600}
                        height={200}
                      />
                    )}
                  </div>
                  <div className="flex gap-1 px-2 font-semibold text-brand-text-footer w-full overflow-hidden">
                    <p className="text-nowrap">{mall?.name}</p>
                    <Separator orientation="vertical" className="w-2 " />
                    <p className="text-nowrap">{mall?.address}</p>
                  </div>
                  <div className="flex text-brand-text-footer px-2">
                    <p>
                      {mall?.openTime}-{mall?.closeTime}, +999-
                      {mall?.phone}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <p className="font-bold text-brand-text-primary text-xl">Shops</p>
          <div className="grid grid-cols-1 tablet-md:grid-cols-2 desktop-md:grid-cols-2 gap-6">
            {data?.shops.map((shop: ShopsTypes) => (
              <div key={shop._id} className="max-w-[350px]">
                <CarouselContentCard
                  id={shop._id}
                  closeTime={shop.closeTime}
                  contact={shop.phone}
                  // the correct syntax for accessing data is . operation and optional chaining to make sure data exist before rendering
                  imageUrl={shop.image ? shop.image[0] : ""}
                  location={shop.mallName ? shop.mallName : ""}
                  name={shop.name}
                  openTime={shop.openTime}
                  title="shop"
                />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="mt-10 text-brand-text-secondary">No Shops and Malls..</p>
      )}
    </>
  );
};

export default SubCategoryContent;

"use client";

import DetailPageLoader from "@/components/modules/shared/loadingSkeleton/detailPageLoader";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getSingleMallDataWithShop } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React from "react";

export type ShopTypes = {
  name: string;
  openTime: string;
  closeTime: string;
  phone: string;
  image: string[];
  mallName: string;
  _id: string;
};

const MallDetailPage = () => {
  const params = useParams();
  const id = params?.id;
  const router = useRouter();

  const { data: singleMall, isLoading } = useQuery({
    queryFn: () => getSingleMallDataWithShop(id as string),
    queryKey: ["mall"],
    enabled: !!id,
  });

  // console.log(singleMall);

  if (isLoading) {
    return <DetailPageLoader />;
  }

  const handleRoute = (shopName: string) => {
    router.push(`/malls/${singleMall.name}/shops/${shopName}`);
  };
  return (
    <div className=" flex flex-col items-center">
      {singleMall && (
        <Image
          src={singleMall.imageUrl}
          className="w-full h-[400px] desktop-md:h-[600px] bg-center bg-cover bg-no-repeat"
          alt="mall-img"
          width={900}
          height={600}
        />
      )}
      <div className="w-full tablet-sm:w-[70%] mt-10 leading-10 border-b border-brand-text-primary">
        <p className="text-4xl text-brand-text-primary font-bold">
          {singleMall?.name}
        </p>
        <p className="text-brand-text-primary leading-10 font-bold text-lg">
          {singleMall?.address}
        </p>
        <p>
          {singleMall?.openTime} - {singleMall?.closeTime}, +977-
          {singleMall.phone}
        </p>
      </div>

      {singleMall?.shops ? (
        <div className="w-full tablet-sm:w-[70%] flex flex-col gap-4 mt-4 mb-20">
          <p className="text-lg text-brand-text-primary font-bold">Shops</p>

          <div className="flex gap-4 flex-wrap">
            {singleMall.shops.map((shop: ShopTypes, shopIndex: number) => (
              <React.Fragment key={shopIndex}>
                {/* setting card width and height cause variant width and height for each iteration */}
                <Card
                  className="rounded-md shadow-md w-[400px] h-[300px] flex flex-col gap-2"
                  onClick={() => handleRoute(shop._id)}
                >
                  <div className="overflow-hidden rounded-md w-full h-[200px]">
                    {shop.image ? (
                      <Image
                        src={shop.image[0]}
                        alt="shop_image"
                        className="w-full h-full object-cover rounded-md transition-transform duration-300 ease-in-out transform hover:scale-110"
                        width={200}
                        height={200}
                      />
                    ) : (
                      <div className="w-full h-full rounded-md bg-gray-200 flex items-center justify-center">
                        <p className="text-gray-500">No Image Available</p>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-1 px-2 font-semibold text-brand-text-footer w-full overflow-hidden">
                    <div className="flex gap-2 items-center">
                      <p className="text-nowrap">{shop.name}</p>
                      <Separator
                        orientation="vertical"
                        className="w-0.5 h-4 bg-brand-text-customBlue"
                      />
                      <p className="">{`( Inside ${shop.mallName})`}</p>
                    </div>
                  </div>
                  <div className="flex text-brand-text-footer px-2">
                    <p>
                      {shop.openTime}-{shop.closeTime}, +999-
                      {shop.phone}
                    </p>
                  </div>
                </Card>
              </React.Fragment>
            ))}
          </div>
        </div>
      ) : (
        <div className="w-[70%] leading-10 mt-8">
          <p className="text-lg text-brand-text-primary font-bold">Shops</p>
          <p>No shops added</p>
        </div>
      )}
    </div>
  );
};

export default MallDetailPage;

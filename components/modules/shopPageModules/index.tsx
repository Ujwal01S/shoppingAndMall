"use client";
import { getSingleShop } from "@/app/malls/[id]/shops/[shopName]/page";
import { useQuery } from "@tanstack/react-query";
import { Images, Video } from "lucide-react";
import Image from "next/image";

interface ShopDetailComponentProps {
  name: string;
}

const ShopDetailComponent = ({ name }: ShopDetailComponentProps) => {
  const { data: shopData, isLoading } = useQuery({
    queryFn: () => getSingleShop(name),
    queryKey: ["shop"],
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <p className="text-green-500">Shop Data is loading</p>
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center w-full relative">
      {shopData?.image && (
        <Image
          src={shopData.image[0]}
          alt="shop-img"
          className="w-full h-[550px] bg-no-repeat object-cover"
          width={600}
          height={600}
        />
      )}

      {/* photo and video */}
      <div className="flex absolute top-[530px] w-full justify-start px-96 gap-0">
        <button className="flex hover:text-brand-text-customBlue bg-white justify-between text-black border-2 px-3 py-1 w-40">
          <div className="flex">
            <Images />
            <p>Photos</p>
          </div>
          <span className="rounded-full w-6 bg-[#D5D5D5]">
            {shopData?.image?.length}
          </span>
        </button>
        <button className="flex hover:text-brand-text-customBlue bg-white justify-between text-black border-2 px-3 py-1 w-40">
          <div className="flex">
            <Video />
            <p>Video</p>
          </div>
        </button>
      </div>

      <div className="mt-16 px-96 text-brand-text-primary boorder-2 border-b-2 flex flex-col w-full justify-start">
        <p className="text-3xl  font-bold">{shopData?.name}</p>
        <p className="text-lg font-semibold">{shopData?.mallName}</p>
        <p>
          {shopData?.openTime} - {shopData?.closeTime}, 977+{shopData?.phone}
        </p>
      </div>

      <div className="px-96 mt-4 w-full mb-12 flex flex-col justify-start">
        <p className="text-lg font-semibold text-brand-text-primary">
          Description
        </p>
        <p>{shopData?.description}</p>

        {shopData.image && (
          <div className="grid grid-cols-3 gap-5 mt-6">
            {shopData.image.map((img: string, index: number) => (
              <Image
                key={index}
                alt="item"
                src={img}
                className="h-[250px] w-full"
                width={200}
                height={200}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopDetailComponent;

import { MallTypes } from "@/app/api/category/[name]/route";
import CarouselContentCard from "../../shared/carouselCard";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { ShopTypes } from "@/app/malls/[id]/page";
import { BarLoader } from "react-spinners";
import { useState } from "react";

interface CategoryCardProps {
  data: { mallData: MallTypes[]; shops: ShopTypes[] };
}

const CategoryCard = ({ data }: CategoryCardProps) => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  return (
    <>
      {data?.mallData?.length !== 0 ? (
        <div className="flex flex-col gap-6 w-full px-6 mt-10">
          <p className="font-bold text-brand-text-primary text-xl">Malls</p>

          <div className="grid grid-cols-1 tablet-sm:grid-cols-2 desktop-md:grid-cols-2 gap-6">
            {data?.mallData?.map((mall: MallTypes) => (
              <Card
                className="relative w-[280px] tablet-md:max-w-[350px]"
                key={mall._id}
                onClick={() => router.push(`/malls/${mall?._id}`)}
              >
                <div className="rounded-md shadow-md flex flex-col gap-2">
                  <div className="overflow-hidden">
                    {!isLoading && (
                      <div className="flex items-center justify-center">
                        <BarLoader />
                      </div>
                    )}
                    {mall?.imageUrl && (
                      <Image
                        src={mall?.imageUrl}
                        alt="mall_logo"
                        width={400}
                        height={200}
                        className="h-[150px] tablet-sm:h-[200px] w-full transition-transform duration-300 ease-in-out transform hover:scale-110"
                        onLoad={() => setIsLoading(true)}
                      />
                    )}
                  </div>
                  <div className="flex gap-2 items-center px-2 font-semibold text-brand-text-footer w-full overflow-hidden">
                    <p className="text-nowrap">{mall?.name}</p>
                    <Separator
                      orientation="vertical"
                      className="w-0.5 h-4 text-brand-text-footer bg-brand-text-footer"
                    />
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
          <div className="grid grid-cols-1 tablet-sm:grid-cols-2 desktop-md:grid-cols-2 gap-6">
            {data?.shops?.length !== 0 &&
              data?.shops?.map((shop: ShopTypes) => (
                <div
                  key={shop._id}
                  className="w-[280px] tablet-md:max-w-[350px]"
                >
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
        <p className="mt-10 text-brand-text-secondary">No Shops and Malls</p>
      )}
    </>
  );
};

export default CategoryCard;

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
  const noContent = !data?.mallData?.length && !data?.shops?.length;
  return (
    <>
      {!noContent ? (
        <div className="flex flex-col gap-6 w-full px-6 mt-10">
          <p className="font-bold text-brand-text-primary text-xl">Malls</p>

          <div className="flex flex-wrap gap-4">
            {data?.mallData?.map((mall: MallTypes) => (
              <Card
                className="relative w-full tablet-md:w-[270px]"
                key={mall._id}
                onClick={() => router.push(`/malls/${mall?._id}`)}
              >
                <div className="rounded-md shadow-md flex flex-col gap-1">
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
                  <div className="flex gap-1 items-center px-2 font-semibold text-brand-text-footer w-full overflow-hidden">
                    <p className="text-nowrap font-bold">{mall?.name}</p>
                    <Separator
                      orientation="vertical"
                      className="w-0.5 h-4 text-brand-text-footer bg-brand-text-footer"
                    />
                    <p className="text-nowrap font-bold">{mall?.address}</p>
                  </div>
                  <div className="flex text-brand-text-footer px-2 overflow-hidden">
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
          <div className="flex flex-wrap gap-3">
            {data?.shops?.length !== 0 &&
              data?.shops?.map((shop: ShopTypes) => (
                <div key={shop._id} className="w-full tablet-md:w-[270px]">
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
        <p className="mt-10 px-6 text-brand-text-secondary">
          No Shops and Malls Yet!
        </p>
      )}
    </>
  );
};

export default CategoryCard;

"use client";

import { ContentProps } from "@/components/carousel";
import MallCard from "../shared/mallCard";
import { useQuery } from "@tanstack/react-query";
import { getAllShopData } from "../homePageModule/homepageContent";
import { ShopsTypes } from "@/app/api/category/[name]/route";
import MallShopLoader from "../shared/loadingSkeleton/mallShopLoader";
import { getSearchShopData } from "@/lib/api";
import { createMallCardData } from "@/lib/createMallCardData";

type ShopContentType = {
  searchData: string;
};

const ShopContent = ({ searchData }: ShopContentType) => {
  const { data: shopData, isLoading } = useQuery({
    queryFn: () => getAllShopData(),
    queryKey: ["shop"],
  });

  const { data: searchedShopData } = useQuery({
    queryFn: () => getSearchShopData(searchData as string),
    queryKey: ["shop", searchData],
    enabled: !!searchData,
  });

  if (isLoading) {
    return <MallShopLoader title="Shops" />;
  }

  const newShopData =
    Array.isArray(shopData) &&
    shopData.map((shop: ShopsTypes) => ({
      _id: shop._id,
      name: shop.name,
      openTime: shop.openTime,
      closeTime: shop.closeTime,
      address: shop.mallName,
      phone: shop.phone,
      imageUrl: shop.image ? shop.image[0] : undefined,
    }));

  const searchedShop = createMallCardData(searchedShopData);
  // console.log("Created Data:", searchedShop);

  // console.log(newShopData);
  return (
    <div className="flex flex-col gap-4">
      <p className="text-2xl font-bold text-brand-text-secondary">Shops</p>

      {/* width variation issue aucha grid-cols-1 nahalyo vaney */}

      <div className="grid grid-cols-1 mobile-lg:grid-cols-2 desktop-md:grid-cols-3 gap-6 items-center justify-center">
        {searchData ? (
          <>
            {Array.isArray(searchedShop) && searchedShop.length > 0 ? (
              searchedShop.map((mall: ContentProps) => (
                <MallCard content={mall} key={mall._id} title="shop" />
              ))
            ) : (
              <p className="text-brand-text-secondary">No shops available..</p>
            )}
          </>
        ) : (
          <>
            {Array.isArray(newShopData) && newShopData.length > 0 ? (
              newShopData.map((mall: ContentProps) => (
                <MallCard content={mall} key={mall._id} title="shop" />
              ))
            ) : (
              <p className="text-brand-text-secondary">No Match available..</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ShopContent;

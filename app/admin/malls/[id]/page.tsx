"use client";

import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { FilePenLine } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";

import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import AddNewShopComponent from "@/components/modules/addNewShop";

export type ShopTypes = {
  name: string;
  openTime: string;
  closeTime: string;
  phone: string;
  image: string[];
  mallName: string;
};

export const getSingleMallDataWithShop = async (id: string) => {
  const { data } = await axios.get(`/api/mall/${id}`);
  return data;
};

const MallDetailPage = () => {
  const params = useParams();
  const { data: session } = useSession();
  const id = params?.id;
  const router = useRouter();

  const [open, setOpen] = useState<boolean>(false);

  const { data: singleMall, isLoading } = useQuery({
    queryFn: () => getSingleMallDataWithShop(id as string),
    queryKey: ["mall"],
    enabled: !!id,
  });

  // console.log(singleMall);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <p className="text-green-500">Data is Loading</p>
      </div>
    );
  }

  console.log(session?.user.role);

  const handleRoute = (shopName: string) => {
    console.log("clicked");
    if (session?.user.role === "admin") {
      router.push(`/admin/malls/${singleMall.name}/shops/${shopName}`);
    } else {
      router.push(`/malls/${singleMall.name}/shops/${shopName}`);
    }
  };

  return (
    <div className=" flex flex-col items-center">
      {singleMall && (
        <img
          src={singleMall.imageUrl}
          className="w-full h-[600px] bg-center bg-cover bg-no-repeat"
        />
      )}

      <div className="w-[70%] mt-10 leading-10 border-b border-brand-text-primary">
        <div className="flex justify-between">
          <p className="text-4xl text-brand-text-primary font-bold">
            {singleMall?.name}
          </p>
          {session?.user.role === "admin" && (
            <div className="flex gap-3">
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger className="">
                  <p className="text-white items-center gap-3 font-semibold bg-brand-text-footer hover:bg-brand-text-customBlue px-4 py-0.5">
                    Add New Shop
                  </p>
                </DialogTrigger>
                <AddNewShopComponent
                  name={singleMall.name}
                  setOpen={setOpen}
                  operation="add"
                />
              </Dialog>

              <button className="text-white flex items-center gap-3 font-semibold bg-brand-text-footer hover:bg-brand-text-customBlue px-4 py-0.5">
                <FilePenLine size={20} />
                Edit
              </button>
            </div>
          )}
        </div>
        <p className="text-brand-text-primary leading-10 font-bold text-lg">
          {singleMall?.address}
        </p>
        <p>
          {singleMall?.openTime} - {singleMall?.closeTime}, +977-
          {singleMall.phone}
        </p>
      </div>

      {singleMall?.shops ? (
        <div className="w-[70%] flex flex-col gap-4 mt-4 mb-20">
          <p className="text-lg text-brand-text-primary font-bold">Shops</p>

          <div className="flex gap-4 flex-wrap">
            {singleMall.shops.map((shop: ShopTypes, shopIndex: number) => (
              <React.Fragment key={shopIndex}>
                {/* setting card width and height cause variant width and height for each iteration */}
                <Card
                  className="rounded-md shadow-md w-[400px] h-[300px] flex flex-col gap-2"
                  onClick={() => handleRoute(shop.name)}
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

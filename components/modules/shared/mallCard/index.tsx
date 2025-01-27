"use client";
import { Card } from "@/components/ui/card";
// import { list_of_mall as listOfMall } from "@/json_data/list_of_mall.json";
import { Delete, X } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ContentProps } from "@/components/carousel";
import { BarLoader } from "react-spinners";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteMallApi, deleteShopApi } from "@/lib/api";

type MallCardType = {
  content: ContentProps;
  title: "mall" | "shop" | "category" | "shopCategory";
};

const MallCard = ({ content, title }: MallCardType) => {
  const [isHovered, setIsHovered] = useState(false);
  const { data: session } = useSession();
  const [open, setOpen] = useState<boolean>(false);
  const router = useRouter();
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  // const [mounted, setMounted] = useState(false);

  // useEffect(() => {
  //   setMounted(true);
  // }, []);

  const handleRouter = () => {
    if (session?.user.role === "user") {
      if (title === "mall" || title === "category") {
        router.push(`/malls/${content._id}`);
      }
      if (title === "shop" || title === "shopCategory") {
        router.push(`/malls/${content.address}/shops/${content._id}`);
      }
    } else {
      if (title === "mall" || title === "category") {
        router.push(`/admin/malls/${content._id}`);
      }
      if (title === "shop" || title === "shopCategory") {
        router.push(`/admin/malls/${content.address}/shops/${content._id}`);
      }
    }
  };

  const handleDeleteMall = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpen(true);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  // console.log(content.shops);

  const queryClient = useQueryClient();

  const { mutate: deleteMall } = useMutation({
    mutationFn: (id: string) => deleteMallApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mall"] });
    },
  });

  const { mutate: deleteShop } = useMutation({
    mutationFn: (id: string) => deleteShopApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shop"] });
    },
  });

  const handleDelete = (id: string) => {
    // console.log(id);
    if (title === "mall") {
      if (content?.shops && content.shops?.length !== 0) {
        content?.shops.map((shop) => {
          deleteShop(shop);
        });
      }
      deleteMall(id);
    }
    if (title === "shop") {
      deleteShop(id);
    }
    setOpen(false);
  };

  // if (!mounted) {
  //   return null;
  // }

  return (
    <>
      <Card
        onClick={handleRouter}
        className="relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="rounded-md shadow-md flex flex-col gap-2">
          <div className="overflow-hidden h-[200px]">
            {!imageLoaded && (
              <div className="h-[200px] w-[400px] flex items-center justify-center">
                <BarLoader />
              </div>
            )}

            {content.imageUrl && (
              <Image
                src={content.imageUrl}
                alt="mall_logo"
                className="h-[200px] w-full rounded-md transition-transform duration-300 ease-in-out transform hover:scale-110"
                width={600}
                height={200}
                onLoad={() => setImageLoaded(true)}
              />
            )}
          </div>
          {session?.user.role === "admin" &&
            isHovered &&
            title !== "category" &&
            title !== "shopCategory" && (
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger className="absolute top-2 right-2">
                  <X
                    onClick={handleDeleteMall}
                    size={32}
                    className="z-10 text-white bg-red-500 rounded-full cursor-pointer "
                  />
                </DialogTrigger>
                <DialogContent>
                  <div className="text-center pb-6">
                    <Delete size={80} className="mx-auto text-red-500" />
                    <DialogTitle className="mx-auto my-4 ">
                      <p className="text-2xl font-black text-gray-800">
                        Confirm Delete
                      </p>
                      <p className=" text-gray-500">
                        Are you sure you want to Delete?
                      </p>
                    </DialogTitle>

                    <div className="flex gap-7 w-full items-center px-5 justify-between">
                      <button
                        onClick={(e) => {
                          handleDelete(content._id);
                          e.stopPropagation();
                        }}
                        className=" bg-red-600 px-10 rounded-md py-2 font-semibold text-white shadow-md hover:shadow-blue-400/40 hover:bg-red-700"
                      >
                        <p>Delete</p>
                      </button>

                      <button
                        onClick={(e: React.MouseEvent) => {
                          setOpen(false);
                          e.stopPropagation();
                        }}
                        className="bg-slate-600 text-white px-10 py-2 rounded-md ml-14 shadow-md hover:shadow-slate-400 hover:bg-slate-700"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}

          <div className="flex gap-4 px-2 font-semibold text-brand-text-footer w-full overflow-hidden">
            <p className="text-nowrap">{content.name}</p>
            <p className="text-nowrap">{content.address}</p>
          </div>
          <div className="flex text-brand-text-footer px-2">
            <p>
              {content.openTime}-{content.closeTime}, +999-
              {content.phone}
            </p>
          </div>
        </div>
      </Card>
    </>
  );
};

export default MallCard;

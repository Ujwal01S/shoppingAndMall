"use client";
import { Separator } from "@/components/ui/separator";
import { Delete, X } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteMallApi, deleteShopApi } from "@/lib/api";

export type CarouselContentCardProps = {
  id: string;
  name: string;
  location: string;
  imageUrl: string;
  openTime: string;
  closeTime: string;
  contact: string;
  title: string;
  shops?: string[];
};

const CarouselContentCard = ({
  closeTime,
  contact,
  imageUrl,
  location,
  name,
  openTime,
  id,
  title,
  shops,
}: CarouselContentCardProps) => {
  const router = useRouter();
  const { data: session } = useSession();
  const [isHover, setIsHover] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const queryClient = useQueryClient();

  const handleMouseEnter = () => {
    setIsHover(true);
  };

  const handleMouseLeave = () => {
    setIsHover(false);
  };

  // console.log(session?.user.role);

  const handleRoute = () => {
    if (session?.user.role === "user") {
      if (title === "mall") {
        router.push(`/malls/${id}`);
      }
      if (title === "shop") {
        router.push(`/malls/${id}/shops/${name}`);
      }
    } else {
      if (title === "mall") {
        router.push(`/admin/malls/${id}`);
      }
      if (title === "shop") {
        router.push(`/admin/malls/${id}/shops/${name}`);
      }
    }
  };

  const handleDeleteMall = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpen(true);
    console.log(shops);
  };

  const handleDeleteShop = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpen(true);
  };

  const { mutate: deleteMall } = useMutation({
    mutationFn: () => deleteMallApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mall"] });
    },
  });

  const { mutate: deleteShop } = useMutation({
    mutationFn: (shopId: string) => deleteShopApi(shopId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shop"] });
    },
  });

  const hadleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (shops?.length !== 0) {
      shops?.forEach((shop) => {
        deleteShop(shop);
      });
    }
    if (title === "mall") {
      deleteMall();
      setOpen(false);
    }

    if (title === "shop") {
      deleteShop(id);
      setOpen(false);
    }
  };

  return (
    <>
      <div
        className="p-2 relative"
        key={name}
        onClick={handleRoute}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="rounded-md shadow-md flex flex-col">
          <div className="overflow-hidden">
            <img
              src={`${imageUrl}`}
              className="h-[200px] w-full rounded-md transition-transform duration-300 ease-in-out transform hover:scale-110"
              alt="mall-img"
            />
          </div>
          {session?.user.role === "admin" && isHover && (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger>
                {title === "mall" ? (
                  <X
                    onClick={handleDeleteMall}
                    size={32}
                    className="absolute top-2 z-[999999999] right-2 text-white bg-red-500 rounded-full p-1 cursor-pointer "
                  />
                ) : (
                  <X
                    onClick={handleDeleteShop}
                    size={32}
                    className="absolute top-2 z-[999999999] right-2 text-white bg-red-500 rounded-full p-1 cursor-pointer "
                  />
                )}
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
                      onClick={hadleDelete}
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
          <div className="flex gap-1 px-2 font-semibold text-brand-text-footer w-full overflow-hidden">
            <p className="text-nowrap">{name}</p>
            <Separator orientation="vertical" className="w-2 " />
            <p className="text-nowrap">{location}</p>
          </div>
          <div className="flex text-brand-text-footer px-2">
            <p>
              {openTime}-{closeTime}, +999-{contact}
            </p>
          </div>
        </div>
      </div>

      {/* <Modal onClose={() => setOpen(false)} open={open}>
        <div className="text-center pb-6">
          <Delete size={80} className="mx-auto text-red-500" />
          <div className="mx-auto my-4 ">
            <h3 className="text-2xl font-black text-gray-800">
              Confirm Delete
            </h3>
            <p className=" text-gray-500">Are you sure you want to Delete?</p>
          </div>

          <div className="flex gap-7 w-full items-center px-5 justify-between">
            <button
              // onClick={() => handleDelete(id)}
              className=" bg-red-600 px-10 rounded-md py-2 font-semibold text-white shadow-md hover:shadow-blue-400/40 hover:bg-red-700"
            >
              <p>Delete</p>
            </button>

            <button
              onClick={() => setOpen(false)}
              className="bg-slate-600 text-white px-10 py-2 rounded-md ml-14 shadow-md hover:shadow-slate-400 hover:bg-slate-700"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal> */}
    </>
  );
};

export default CarouselContentCard;

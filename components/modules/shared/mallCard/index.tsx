"use client";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
// import { list_of_mall as listOfMall } from "@/json_data/list_of_mall.json";
import { Delete, X } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ContentProps } from "@/components/carousel";
import Modal from "../modal";
import { BarLoader } from "react-spinners";

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
    setOpen(true);
    e.stopPropagation();
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <>
      <Card
        onClick={handleRouter}
        className="relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="rounded-md shadow-md flex flex-col gap-2">
          <div className="overflow-hidden">
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
            {session?.user.role === "admin" &&
              isHovered &&
              title !== "category" &&
              title !== "shopCategory" && (
                <X
                  onClick={handleDeleteMall}
                  size={32}
                  className="absolute top-2 z-10 right-2 text-white bg-red-500 rounded-full p-1 cursor-pointer "
                />
              )}
          </div>
          <div className="flex gap-1 px-2 font-semibold text-brand-text-footer w-full overflow-hidden">
            <p className="text-nowrap">{content.name}</p>
            <Separator orientation="vertical" className="w-2 " />
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

      <Modal onClose={() => setOpen(false)} open={open}>
        <div className="text-center pb-6">
          <Delete size={80} className="mx-auto text-red-500" />
          <div className="mx-auto my-4 ">
            <h3 className="text-2xl font-black text-gray-800">
              Confirm Delete
            </h3>
            <p className=" text-gray-500">Are you sure you want to Delete?</p>
          </div>

          <div className="flex gap-7 w-full items-center px-56 justify-between">
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
      </Modal>
    </>
  );
};

export default MallCard;

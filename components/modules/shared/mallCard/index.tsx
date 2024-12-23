"use client";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { list_of_mall as listOfMall } from "@/json_data/list_of_mall.json";
import { X } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

type MallCardType = {
  content: (typeof listOfMall)[0];
};

const MallCard = ({ content }: MallCardType) => {
  const [isHovered, setIsHovered] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  const handleRouter = () => {
    console.log("hello from route");

    router.push("/malls/demo");
  };

  const handleDeleteMall = (e: React.MouseEvent) => {
    console.log("Delete Mall");
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
        className="relative z-20"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="rounded-md shadow-md flex flex-col gap-2">
          <div className="overflow-hidden">
            <Image
              src={content.imageUrl}
              alt="mall_logo"
              className="h-[200px] w-full rounded-md transition-transform duration-300 ease-in-out transform hover:scale-110"
              width={600}
              height={200}
            />
            {session?.user.role === "admin" && isHovered && (
              <X
                onClick={handleDeleteMall}
                size={32}
                className="absolute top-2 z-[999999999] right-2 text-white bg-red-500 rounded-full p-1 cursor-pointer "
              />
            )}
          </div>
          <div className="flex gap-1 px-2 font-semibold text-brand-text-footer w-full overflow-hidden">
            <p className="text-nowrap">{content.name}</p>
            <Separator orientation="vertical" className="w-2 " />
            <p className="text-nowrap">{content.location}</p>
          </div>
          <div className="flex text-brand-text-footer px-2">
            <p>
              {content.openTime}-{content.closeTime}, +999-
              {content.contact}
            </p>
          </div>
        </div>
      </Card>
    </>
  );
};

export default MallCard;

"use client";

import { useQuery } from "@tanstack/react-query";
import { FilePenLine, Images, Video } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import ImageViewer from "../shared/imageViewerModel";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import AddNewShopComponent from "../addNewShop";
import EventLinkButton from "../shared/button";
import DetailPageLoader from "../shared/loadingSkeleton/detailPageLoader";
import VideoViewerModel from "../shared/videoViewerModel";
import { getSingleShop } from "@/lib/api";
import { useSession } from "next-auth/react";
import { BarLoader } from "react-spinners";
interface ShopDetailComponentProps {
  name: string;
}

const ShopDetailComponent = ({ name }: ShopDetailComponentProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const [viewerImage, setViewerImage] = useState<string[]>([]);
  const [count, setCount] = useState<number>(0);
  const [transitionClass, setTransitionClass] = useState<string>("");
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [video, setVideo] = useState<string | null>(null);
  const [showVidoe, setShowVideo] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // const [totalLength, setTotalLength] = useState<number>(0);

  const { data: session } = useSession();

  const { data: shopData, isLoading: dataIsLoading } = useQuery({
    queryFn: () => getSingleShop(name),
    queryKey: ["shop"],
  });

  const handleImageClick = (index: number) => {
    setCount(index);
    setOpen(true);
  };

  // console.log(shopData);
  useEffect(() => {
    if (shopData) {
      setViewerImage(shopData?.image);
      setVideo(shopData?.video);
      // setTotalLength(viewerImage.length);
    } else {
      setViewerImage([]);
      setVideo("");
    }
  }, [shopData]);

  const totalLength = viewerImage?.length;

  useEffect(() => {
    setTransitionClass("opacity-0");
    const timer = setTimeout(() => {
      setTransitionClass("opacity-100");
    }, 100);
    return () => clearTimeout(timer);
  }, [count]);

  if (dataIsLoading) {
    return <DetailPageLoader />;
  }

  const handleEditClick = () => {
    console.log("clicked!");
  };
  return (
    <div className="flex flex-col items-center w-full relative">
      {shopData?.image && (
        <Image
          src={shopData.image[0] ?? "/Food1.jpg"}
          alt="shop-img"
          className="w-full h-[450px] desktop-md:h-[550px] bg-no-repeat object-cover"
          width={600}
          height={600}
        />
      )}
      {/* photo and video */}
      <div className="flex absolute top-[430px] desktop-md:top-[530px] w-full justify-start desktop-md:px-72 gap-0">
        <button
          onClick={() => setOpen(true)}
          className="flex hover:text-brand-text-customBlue bg-white justify-between text-black border-2 px-3 py-1 w-40"
        >
          <div className="flex">
            <Images />
            <p>Photos</p>
          </div>
          <span className="rounded-full w-6 bg-[#D5D5D5]">
            {shopData?.image?.length}
          </span>
        </button>
        {video ? (
          <button
            onClick={() => setShowVideo(true)}
            className={`flex hover:text-brand-text-customBlue bg-white justify-between text-black border-2 px-3 py-1 w-40`}
          >
            <div className="flex">
              <Video />
              <p>Video</p>
            </div>
          </button>
        ) : (
          <button
            className={`flex  bg-white justify-between text-brand-text-secondary border-2 px-3 py-1 w-40`}
          >
            <div className="flex">
              <Video />
              <p>Video</p>
            </div>
          </button>
        )}
      </div>
      <VideoViewerModel open={showVidoe} setOpen={setShowVideo}>
        <video src={video || undefined} controls className="my-10 h-[80vh]" />
      </VideoViewerModel>

      <div className="mt-16 desktop-md:px-72 text-brand-text-primary boorder-2 border-b-2 flex flex-col w-full justify-start">
        <div className="flex w-full justify-between">
          <p className="text-3xl  font-bold">{shopData?.name}</p>
          {session?.user.role === "admin" && (
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
              <DialogTrigger>
                <EventLinkButton
                  content="Edit"
                  onClick={handleEditClick}
                  icon={<FilePenLine size={20} />}
                />
              </DialogTrigger>
              <AddNewShopComponent
                setOpen={setOpenDialog}
                operation="update"
                shopName={shopData?.name}
                shopLevel={shopData?.level}
                shopDescription={shopData?.description}
                shopPhone={shopData?.phone}
                shopCategory={shopData?.category}
                shopSubCategory={shopData?.subCategory}
                shopOpenTime={shopData?.openTime}
                shopCloseTime={shopData?.closeTime}
                images={shopData?.image}
                id={shopData?._id}
                name={shopData?.mallName}
                shopVideo={shopData?.video}
              />
            </Dialog>
          )}
        </div>
        <p className="text-lg font-semibold">{shopData?.mallName}</p>
        <p>
          {shopData?.openTime} - {shopData?.closeTime}, 977+{shopData?.phone}
        </p>
      </div>
      <div className="desktop-md:px-72 mt-4 w-full mb-12 flex flex-col justify-start">
        <p className="text-lg font-semibold text-brand-text-primary">
          Description
        </p>
        <p>{shopData?.description}</p>

        {shopData.image && (
          <div className="grid mobile-xl:grid-cols-2 desktop-md:grid-cols-3 gap-6">
            {shopData.image.map((img: string, index: number) => (
              <React.Fragment key={index}>
                {!isLoading && (
                  <div className="flex items-center justify-center">
                    <BarLoader />
                  </div>
                )}
                <Image
                  alt="item"
                  src={img}
                  className="h-[250px] min-w-[300px]"
                  width={200}
                  height={200}
                  onLoad={() => setIsLoading(true)}
                  onClick={() => handleImageClick(index)}
                />
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
      <ImageViewer
        open={open}
        setOpen={setOpen}
        count={count}
        setCount={setCount}
        totalImage={totalLength}
      >
        <div className="w-full border-2 border-white h-[40dvh] tablet-md:h-[80dvh]">
          {Array.isArray(viewerImage) &&
            viewerImage?.length > 0 &&
            viewerImage[count] &&
            viewerImage[count] !== "" && (
              <Image
                src={viewerImage[count]}
                alt="shop_img"
                width={200}
                height={200}
                className={`w-full h-full bg-no-repeat object-cover ${transitionClass}`}
              />
            )}
        </div>
      </ImageViewer>
    </div>
  );
};

export default ShopDetailComponent;

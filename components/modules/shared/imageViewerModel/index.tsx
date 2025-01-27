"use client";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { useState } from "react";
import Fullscreen from "react-fullscreen-crossbrowser";

type ImageViewerTypes = {
  children: React.ReactNode;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setCount: React.Dispatch<React.SetStateAction<number>>;
  count: number;
  totalImage: number;
};

const ImageViewer = ({
  children,
  open,
  setOpen,
  count,
  setCount,
  totalImage,
}: ImageViewerTypes) => {
  const [fullScreen, setFullScreen] = useState(false);
  const handleLeftClick = () => {
    if (count !== 0) {
      setCount(count - 1);
    }
    if (count === 0) {
      setCount(totalImage - 1);
    }
  };

  const handleRightClick = () => {
    if (count !== totalImage - 1) {
      setCount(count + 1);
    }
    if (count === totalImage - 1) {
      setCount(0);
    }
  };

  const handleFullScreenToggle = () => {
    setFullScreen(!fullScreen);
  };
  return (
    <div
      className={`min-w-screen z-50 fixed min-h-screen inset-0 bg-black ${
        open ? "visible" : "invisible"
      }`}
    >
      <div className="w-full text-white mt-10 flex justify-end pr-10 pt-3 ">
        <X
          onClick={() => setOpen(false)}
          className="  hover:border-red-500 hover:text-red-500 hover:scale-125"
        />
      </div>
      <div className="flex gap-4 mt-4 relative mobile-lg:top-[20%] top-[20%] tablet-md:top-0">
        <div className="tablet-md:w-[15%] ">
          <span className="text-white flex flex-col h-full justify-between items-center">
            <p className="bg-slate-500 px-4 py-1 hidden tablet-md:flex">
              {count + 1} / {totalImage}
            </p>
            <p className="absolute left-6 text-sm text-white px-1 bg-black top-1 tablet-md:hidden">
              {count + 1}/{totalImage}
            </p>
            <ChevronLeft
              onClick={handleLeftClick}
              size={40}
              className="align-middle hidden tablet-md:flex hover:text-brand-text-customBlue top-20 hover:scale-x-150"
            />
            <ChevronLeft
              onClick={handleLeftClick}
              size={30}
              className="align-middle bg-black/90 text-white tablet-md:hidden absolute  left-5 top-[45%]"
            />
            <p className=""></p>
          </span>
        </div>
        <Fullscreen
          enabled={fullScreen}
          onChange={(isFull) => setFullScreen(isFull)}
        >
          {children}
        </Fullscreen>
        <div className="tablet-md:w-[15%] text-white ">
          <span className="text-white flex flex-col h-full justify-between items-center">
            <p></p>
            <ChevronRight
              onClick={handleRightClick}
              size={40}
              className="align-middle hidden tablet-md:flex hover:text-brand-text-customBlue hover:scale-150"
            />
            <ChevronRight
              onClick={handleRightClick}
              size={30}
              className="align-middle bg-black/90 text-white tablet-md:hidden absolute  right-5 top-[45%]"
            />
            <Expand
              onClick={handleFullScreenToggle}
              className="hover:scale-150 hidden tablet-md:flex"
            />
          </span>
        </div>
      </div>
    </div>
  );
};

export default ImageViewer;

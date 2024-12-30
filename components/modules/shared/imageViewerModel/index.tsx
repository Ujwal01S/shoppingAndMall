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
          className=" border-2 border-white hover:border-red-500 hover:text-red-500 hover:scale-125"
        />
      </div>
      <div className="flex gap-4 mt-4">
        <div className="w-[15%] border-2 border-white">
          <span className="text-white flex flex-col h-full justify-between items-center">
            <p className="bg-slate-500 px-4 py-1">
              {count + 1} / {totalImage}
            </p>
            <ChevronLeft
              onClick={handleLeftClick}
              size={40}
              className="align-middle hover:text-brand-text-customBlue hover:scale-x-150"
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
        <div className="w-[15%] text-white border-2 border-white">
          <span className="text-white flex flex-col h-full justify-between items-center">
            <p></p>
            <ChevronRight
              onClick={handleRightClick}
              size={40}
              className="align-middle hover:text-brand-text-customBlue hover:scale-150"
            />
            <Expand
              onClick={handleFullScreenToggle}
              className="hover:scale-150"
            />
          </span>
        </div>
      </div>
    </div>
  );
};

export default ImageViewer;

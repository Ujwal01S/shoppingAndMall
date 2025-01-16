"use client";
import { X } from "lucide-react";

// import Fullscreen from "react-fullscreen-crossbrowser";

type VideoViewerTypes = {
  children: React.ReactNode;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const VideoViewerModel = ({ children, open, setOpen }: VideoViewerTypes) => {
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
      <div className="flex gap-4 mt-4 items-center justify-center h-[80%]">
        {/* <Fullscreen
          enabled={fullScreen}
          onChange={(isFull) => setFullScreen(isFull)}
        > */}
        {children}
        {/* </Fullscreen> */}
      </div>
    </div>
  );
};

export default VideoViewerModel;

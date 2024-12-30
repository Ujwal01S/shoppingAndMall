"use client";

import { ShopDataContext } from "@/store/editShopContext";
import React, { useContext } from "react";

type EditShopImageAndVideoType = {
  index: number;
};

const EditShopImageAndVideo = ({ index }: EditShopImageAndVideoType) => {
  const { ctxShopData, setCtxShopData } = useContext(ShopDataContext);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let selectedFile;
    if (e.target.files) {
      selectedFile = e.target.files[0];
    }
    if (selectedFile) {
      setCtxShopData((prev) => {
        const updatedData = [...prev];
        const currentImages = ctxShopData[index]?.image || [];
        updatedData[index] = {
          ...updatedData[index],
          image: [...currentImages, selectedFile],
        };
        return updatedData;
      });
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="group">
        <input
          type="file"
          accept="image/jpeg"
          className="text-green-600 group-hover:text-[#F1B8B2]"
          onChange={handleImageChange}
          key={ctxShopData[index]?.image.length}
        />
        <div className="flex flex-col mt-2 bg-brand-text-footer w-full text-white px-2 group-hover:bg-brand-text-customBlue">
          <p>Add Image</p>
          <p className="text-xs">
            &quot; &quot;First chosen image will be Thumbnail
          </p>
        </div>
      </label>

      {ctxShopData[index]?.image?.map((image, index) => (
        <React.Fragment key={index}>
          <div className="bg-slate-400 rounded-lg w-fit flex gap-2 pl-2">
            <button
              className="hover:bg-blue-500 cursor-pointer"
              // onClick={() => removeImageHandler(index)}
            >
              X
            </button>
            {/* the typescript has image as file|string so we need to verify if image is file as only file has name */}
            {image instanceof File ? (
              <p>{image.name.slice(0, 38)}</p>
            ) : (
              <p>{image.slice(0, 38)}</p>
            )}
          </div>
        </React.Fragment>
      ))}

      <label className="group">
        <input
          type="file"
          accept="video/*"
          className="text-green-600 group-hover:text-[#F1B8B2]"
        />
        <div className="flex flex-col mt-2 bg-brand-text-footer w-full text-white px-2 group-hover:bg-brand-text-customBlue">
          <p>Add Video</p>
          <p className="text-xs">
            &quot; &quot;the size of the video must be less than 100mb
          </p>
        </div>
      </label>
    </div>
  );
};

export default EditShopImageAndVideo;

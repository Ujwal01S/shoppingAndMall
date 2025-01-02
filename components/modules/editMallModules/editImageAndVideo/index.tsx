"use client";

import { ShopDataContext } from "@/store/editShopContext";
import React, { useContext, useState } from "react";

type EditShopImageAndVideoType = {
  index: number;
};

const EditShopImageAndVideo = ({ index }: EditShopImageAndVideoType) => {
  const { ctxShopData, setCtxShopData } = useContext(ShopDataContext);
  const [inputKey, setInputKey] = useState<number>(Date.now());

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
      setInputKey(Date.now());
    }
  };

  const removeImageHandler = (imageIndex: number) => {
    setCtxShopData((prev) => {
      const updatedData = [...prev];
      updatedData[index] = {
        ...updatedData[index],
        image: updatedData[index].image.filter((_, i) => i !== imageIndex),
      };
      return updatedData;
    });
    setInputKey(Date.now());
  };

  // const currentImages = ctxShopData[index]?.image || [];
  // console.log(currentImages);

  return (
    <div className="flex flex-col gap-2">
      <label className="group">
        <input
          type="file"
          accept="image/jpeg"
          className="text-green-600 group-hover:text-[#F1B8B2]"
          onChange={handleImageChange}
          key={inputKey}
        />
        <div className="flex flex-col mt-2 bg-brand-text-footer w-full text-white px-2 group-hover:bg-brand-text-customBlue">
          <p>Add Image</p>
          <p className="text-xs">
            &quot; &quot;First chosen image will be Thumbnail
          </p>
        </div>
      </label>

      {ctxShopData[index]?.image?.map((image, Imageindex) => (
        <React.Fragment key={Imageindex}>
          <div className="bg-slate-400 rounded-lg w-fit flex gap-2 pl-2">
            <button
              className="hover:bg-blue-500 cursor-pointer"
              onClick={() => removeImageHandler(Imageindex)}
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

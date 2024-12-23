"use client";
import { MediaContext } from "@/store/mediaUploadContext";
import React, { useContext, useState } from "react";

interface MediaUploadProps {
  index: number;
  onAddImageChange: () => void;
  setMallImage: React.Dispatch<React.SetStateAction<File[]>>;
}

const MediaUpload = ({ index, setMallImage }: MediaUploadProps) => {
  const [addImage, setAddImage] = useState<File[]>([]);
  const { setCtxImage } = useContext(MediaContext);

  //   const [addVideo, setAddVideo] = useState<File[]>([]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let selectedFiles;
    if (e.target.files) {
      selectedFiles = e.target.files[0];
    }

    if (selectedFiles) {
      // First, update addImage state and then set ctxImage
      setAddImage((prevImage) => {
        const newImages = [...prevImage, selectedFiles];

        // onAddImageChange();
        // Then, update ctxImage with the newly added image(s)

        setMallImage((prevData) => {
          let updatedData = [...prevData];
          updatedData = [...newImages];
          return updatedData;
        });

        setCtxImage((prevData) => {
          const updatedData = [...prevData];

          if (!updatedData[index]) {
            updatedData[index] = []; // Initialize if necessary
          }

          updatedData[index] = [...newImages]; // Use the updated state value

          return updatedData;
        });

        return newImages; // Return the updated state for addImage
      });
    }
  };

  // console.log("contextAPI", ctxImage[0]);
  //   console.log("useState:", addImage);

  const removeImageHandler = (index: number) => {
    setAddImage((prev) => {
      const updatedImages = prev.filter(
        (_, imageIndex) => imageIndex !== index
      );

      setMallImage((prevData) => {
        let updatedData = [...prevData];
        updatedData = updatedImages;
        return updatedData;
      });

      // directly update mallImage instead of relaying on updatedImages

      // setMallImage((prev) => {
      //   return prev.filter((_, imgIndex) => imgIndex !== index);
      // });

      // Update the context state with the updated image array
      setCtxImage((prevData) => {
        const updatedData = [...prevData];
        updatedData[index] = updatedImages; // Update the specific index in ctxImage
        return updatedData;
      });
      return updatedImages; // Return the updated state for addImage
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="group">
        <input
          type="file"
          accept="image/jpeg"
          className="text-green-600 group-hover:text-[#F1B8B2]"
          onChange={handleImageChange}
          key={addImage.length}
        />
        <div className="flex flex-col mt-2 bg-brand-text-footer w-full text-white px-2 group-hover:bg-brand-text-customBlue">
          <p>Add Image</p>
          <p className="text-xs">
            &quot; &quot;First chosen image will be Thumbnail
          </p>
        </div>
      </label>

      {addImage?.map((image, index) => (
        <React.Fragment key={image.name}>
          <div className="bg-slate-400 rounded-lg w-fit flex gap-2 pl-2">
            <button
              className="hover:bg-blue-500 cursor-pointer"
              onClick={() => removeImageHandler(index)}
            >
              X
            </button>
            {image.name.slice(0, 12)}
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

export default MediaUpload;

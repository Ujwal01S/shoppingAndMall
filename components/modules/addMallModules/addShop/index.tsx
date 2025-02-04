import { UseFormReturn } from "react-hook-form";
import { X } from "lucide-react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";
import { shopCategories } from "@/json_data/shops_category.json";
import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";

import { z } from "zod";
import { shopSchema } from "@/schemas/shopSchema";
import { Progress } from "@/components/ui/progress";

type EditAddShopFormType = {
  index: number;
  uploadProgress: number;
  remove: (index: number) => void;
  form: UseFormReturn<{
    mall: {
      name: string;
      address: string;
      phone: string;
      level: number;
      openTime: string;
      closeTime: string;
      image: File | string;
    };
    shops: z.infer<typeof shopSchema>;
  }>;
};

const EditAddShopForm = ({
  index,
  remove,
  form,
  uploadProgress,
}: EditAddShopFormType) => {
  const [category, setCategory] = useState<string>("");
  const [images, setImages] = useState<(string | File)[]>([]);
  const [video, setVideo] = useState<string | File | undefined>(undefined);

  // console.log({ images });

  const handleMallImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let selectedFile;
    if (e.target.files) {
      selectedFile = e.target.files[0];
    }
    if (selectedFile) {
      // Update state with new image
      setImages((prev) => {
        const newImages = [...prev, selectedFile];
        form.setValue(`shops.${index}.image`, newImages, {
          shouldValidate: true,
          shouldDirty: true,
        });
        return newImages;
      });
    }
  };

  // console.log({ category, subCategory });

  const filteredCategory = shopCategories.filter(
    (shopCategory) => shopCategory.text === category
  );

  const removePrevImageHandler = (imageIndex: number) => {
    setImages((prev) => {
      const updatedImages = prev.filter((_, idx) => idx !== imageIndex);
      // Update form value with filtered images array
      form.setValue(`shops.${index}.image`, updatedImages, {
        shouldValidate: true,
        shouldDirty: true,
      });
      return updatedImages;
    });
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let selectedFile;
    if (e.target.files) {
      selectedFile = e.target.files[0];
      setVideo(selectedFile);
      form.setValue(`shops.${index}.video`, selectedFile);
    }
  };
  return (
    <div className="bg-[#F9F9F9] py-4 rounded flex flex-col gap-3 w-full">
      <div className="flex justify-end">
        <X className="hover:text-red-500" onClick={() => remove(index)} />
      </div>
      <div className="w-full flex gap-3 flex-wrap items-center">
        <FormField
          control={form.control}
          name={`shops.${index}.name`}
          render={({ field }) => (
            <FormItem className="w-full mobile-md:w-[48%] desktop-md:w-[32%] min-h-[70px]">
              <FormControl>
                <Input
                  {...field}
                  placeholder="Shop Name"
                  className="shadow-none border-brand-text-secondary focus-visible:ring-0 focus-visible:outline-2 focus-visible:outline-brand-text-customBlue focus:border-none"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`shops.${index}.level`}
          render={({ field }) => (
            <FormItem className="w-full mobile-md:w-[48%] desktop-md:w-[32%] min-h-[70px]">
              <FormControl>
                <Input
                  {...field}
                  placeholder="Level"
                  className="px-2 shadow-none border-brand-text-secondary focus-visible:ring-0 focus-visible:outline-2 focus-visible:outline-brand-text-customBlue focus:border-none"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`shops.${index}.phone`}
          render={({ field }) => (
            <FormItem className="w-full mobile-md:w-[48%] desktop-md:w-[32%] min-h-[70px]">
              <FormControl>
                <Input
                  {...field}
                  placeholder="Phone Number"
                  className="px-2 shadow-none border-brand-text-secondary focus-visible:ring-0 focus-visible:outline-2 focus-visible:outline-brand-text-customBlue focus:border-none"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`shops.${index}.category`}
          render={({ field }) => (
            <FormItem className="w-full mobile-md:w-[48%] desktop-md:w-[32%] min-h-[70px]">
              <FormControl>
                <Select
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value);
                    setCategory(value);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={category ? category : "categories"}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {shopCategories.map((category, index) => (
                      <SelectItem key={index} value={category.text}>
                        {category.text}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`shops.${index}.subCategory`}
          render={({ field }) => (
            <FormItem className="w-full mobile-md:w-[48%] desktop-md:w-[32%] min-h-[70px]">
              <FormControl>
                {filteredCategory[0]?.content.length > 0 ? (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          field.value ? field.value : "SubCategories"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {shopCategories.map((subCategory, index) => (
                        <React.Fragment key={index}>
                          {category === subCategory.text && (
                            <>
                              {subCategory.content.map((c, contentIndex) => (
                                <SelectItem
                                  key={contentIndex}
                                  value={c.subContent}
                                >
                                  {c.subContent}
                                </SelectItem>
                              ))}
                            </>
                          )}
                        </React.Fragment>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="border-2 px-2 py-2 rounded-md text-sm w-full text-brand-text-secondary">
                    SubCategories
                  </p>
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="flex flex-col tablet-sm:flex-row gap-1 w-full">
        <div className="flex flex-col w-full">
          <FormField
            control={form.control}
            name={`shops.${index}.openTime`}
            render={({ field }) => (
              <FormItem className="flex flex-col w-full">
                <FormLabel>Open Time:</FormLabel>
                <FormControl>
                  <TimePicker
                    className="w-1/2"
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col w-full">
          <FormField
            control={form.control}
            name={`shops.${index}.closeTime`}
            render={({ field }) => (
              <FormItem className="flex flex-col w-full">
                <FormLabel>Close Time:</FormLabel>
                <FormControl>
                  <TimePicker
                    className="w-1/2"
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <div>
        <p className="text-brand-text-secondary">
          Please note that the shop timing has to be under the range of mall
          timings.
        </p>
      </div>

      <FormField
        control={form.control}
        name={`shops.${index}.description`}
        render={({ field }) => (
          <FormItem className="flex flex-col w-full">
            <FormControl>
              <Textarea
                id="description"
                placeholder="Description"
                value={field.value}
                onChange={field.onChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <label className="flex flex-col text-green-600 cursor-pointer hover:text-[#EFB6B2]">
        {/* <ImageUp size={24} />
        <p className="text-xs">
          {"("}Add Image{")"}
        </p> */}

        <FormField
          control={form.control}
          name={`shops.${index}.image`}
          render={({ ...rest }) => (
            <>
              <FormItem>
                <FormControl>
                  <input
                    hidden
                    type="file"
                    accept="image/jpeg"
                    key={images.length}
                    {...rest}
                    onChange={(event) => {
                      handleMallImageChange(event);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </>
          )}
        />
        <div className="flex flex-col mt-2 bg-brand-text-footer w-full text-white px-2 group-hover:bg-brand-text-customBlue">
          <p>Add Image</p>
          <p className="text-xs">
            &quot; &quot;First chosen image will be Thumbnail
          </p>
        </div>
      </label>
      {images.map((image, index) => (
        <React.Fragment key={index}>
          <div className="bg-slate-400 rounded-lg w-fit flex gap-2 pl-2">
            <button
              className="hover:bg-blue-500 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                removePrevImageHandler(index);
              }}
            >
              X
            </button>
            {/* {image.slice(0, 12)} */}
            {image instanceof File ? (
              <p>{image?.name.slice(0, 38)}</p>
            ) : (
              <p>{image.slice(0, 38)}</p>
            )}
          </div>
        </React.Fragment>
      ))}

      <label>
        <div className="flex flex-col mt-2 bg-brand-text-footer w-full text-white px-2 group-hover:bg-brand-text-customBlue">
          <p>Add Video</p>
          <p className="text-xs">
            &quot; &quot;the size of the video must be less than 10mb
          </p>
        </div>
        <FormField
          control={form.control}
          name={`shops.${index}.video`}
          render={({ ...rest }) => (
            <>
              <FormItem>
                <FormControl>
                  <input
                    hidden
                    type="file"
                    accept="video/*"
                    key={images.length}
                    {...rest}
                    onChange={(event) => {
                      handleVideoChange(event);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </>
          )}
        />
      </label>
      {video && (
        <div className="flex gap-2">
          <button
            className="hover:bg-blue-500 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setVideo(undefined);
              form.setValue(`shops.${index}.video`, undefined);
            }}
          >
            X
          </button>
          {video instanceof File ? (
            <p>{video.name.slice(0, 24)}</p>
          ) : (
            <p>{video.slice(0, 24)}</p>
          )}
        </div>
      )}

      {uploadProgress > 0 && (
        <div className="w-full">
          <p className="text-lg text-brand-text-tertiary">
            Progress: {uploadProgress}%
          </p>
          <Progress
            value={uploadProgress}
            max={100}
            className="w-full h-4"
            indicatorClassName="bg-brand-text-footer"
          />
        </div>
      )}
    </div>
  );
};

export default EditAddShopForm;

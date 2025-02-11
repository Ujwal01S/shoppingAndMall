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
import React, { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";

import { z } from "zod";
import { shopSchema } from "@/schemas/shopSchema";
import { Progress } from "@/components/ui/progress";
import { phoneRegex } from "@/schemas/mallSchema";

type EditAddShopFormType = {
  index: number;
  uploadProgress: number;
  remove: (index: number) => void;
  mallOpenTime: string;
  mallCloseTime: string;
  mallLevel: number;
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
  mallCloseTime,
  mallLevel,
  mallOpenTime,
}: EditAddShopFormType) => {
  const [category, setCategory] = useState<string>("");
  const [images, setImages] = useState<(string | File)[]>([]);
  // console.log({ mallCloseTime, mallOpenTime, mallLevel });

  const apiCategory = form.watch(`shops.${index}.category`);

  useEffect(() => {
    setCategory(apiCategory);
  }, [apiCategory]);

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

  return (
    <div className="bg-[#F9F9F9] py-4 rounded flex flex-col gap-3 w-full">
      <div className="flex justify-end">
        <X className="hover:text-red-500" onClick={() => remove(index)} />
      </div>
      <div className="sr-only">
        <FormField
          control={form.control}
          name={`shops.${index}._id`}
          render={({ field }) => (
            <FormItem className="w-full mobile-md:w-[48%] desktop-md:w-[32%] min-h-[70px] border-2 border-red-600">
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
                  onChange={(e) => {
                    const inputLevel = parseInt(e.target.value);
                    field.onChange(e.target.value);
                    if (inputLevel > mallLevel) {
                      form.setError(`shops.${index}.level`, {
                        type: "Manual",
                        message: `The level should be in range 0 - ${mallLevel}`,
                      });
                    } else {
                      form.clearErrors(`shops.${index}.level`);
                    }
                  }}
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
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "" || phoneRegex.test(value)) {
                      field.onChange(value);
                      form.clearErrors(`shops.${index}.phone`);
                    } else {
                      form.setError(`shops.${index}.phone`, {
                        type: "manual",
                        message: "Please enter a valid phone number",
                      });
                    }
                  }}
                  onBlur={(e) => {
                    field.onBlur();
                    if (!phoneRegex.test(e.target.value)) {
                      form.setError(`shops.${index}.phone`, {
                        type: "manual",
                        message: "Please enter a valid phone number",
                      });
                    } else {
                      form.clearErrors(`shops.${index}.phone`);
                    }
                  }}
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
                    onChange={(value) => {
                      field.onChange(value);
                      const shopOpenTime = value;
                      if (shopOpenTime && mallOpenTime) {
                        const [shopHour, shopMinute] = shopOpenTime
                          .split(":")
                          .map(Number);
                        const [mallHour, mallMinute] = mallOpenTime
                          .split(":")
                          .map(Number);

                        const shopTimeInMinute = shopHour * 60 + shopMinute;
                        const mallTimeInMinute = mallHour * 60 + mallMinute;

                        if (shopTimeInMinute < mallTimeInMinute) {
                          form.setError(`shops.${index}.openTime`, {
                            type: "Manual",
                            message: `Shop cann't open before mall open time : (${mallOpenTime})`,
                          });
                        } else {
                          form.clearErrors(`shops.${index}.openTime`);
                        }
                      }
                    }}
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
                    onChange={(value) => {
                      field.onChange(value);
                      const shopClose = value;
                      if (shopClose && mallCloseTime) {
                        const [shopHour, shopMinute] = shopClose
                          .split(":")
                          .map(Number);
                        const [mallHour, mallMinute] = mallCloseTime
                          .split(":")
                          .map(Number);

                        const shopCloseInMinute = shopHour * 60 + shopMinute;
                        const mallCloseInMinute = mallHour * 60 + mallMinute;

                        if (shopCloseInMinute > mallCloseInMinute) {
                          form.setError(`shops.${index}.closeTime`, {
                            type: "Manual",
                            message: `Shop can't close after mall close time : (${mallCloseTime})`,
                          });
                        } else {
                          form.clearErrors(`shops.${index}.closeTime`);
                        }
                      }
                    }}
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

      {/* <ImageUp size={24} />
        <p className="text-xs">
          {"("}Add Image{")"}
        </p> */}

      <FormField
        control={form.control}
        name={`shops.${index}.image`}
        render={({ field, ...rest }) => (
          <>
            <FormItem>
              <FormLabel>
                <div className="flex flex-col py-2 mt-2 bg-brand-text-footer w-full text-white px-2 group-hover:bg-brand-text-customBlue hover:bg-brand-text-customBlue">
                  <p>Add Image</p>
                  <p className="text-xs">
                    &quot; &quot;First chosen image will be Thumbnail
                  </p>
                </div>
              </FormLabel>
              <FormControl>
                <input
                  hidden
                  type="file"
                  accept="image/jpeg"
                  multiple
                  key={images.length}
                  {...rest}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setImages(field.value);
                    handleMallImageChange(e);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>

            {field.value.map((image: string | File, imgIndex: number) => (
              <React.Fragment key={imgIndex}>
                <div className="rounded-lg w-fit flex bg-slate-300 gap-2 pl-2 mb-1">
                  <button
                    type="button"
                    className="hover:bg-blue-500 cursor-pointer rounded-full"
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                      e.stopPropagation();
                      const updatedImages = field.value.filter(
                        (_: string | File, i: number) => i !== imgIndex
                      );
                      // setImages(updatedImages);
                      field.onChange(updatedImages);
                    }}
                  >
                    X
                  </button>
                  {image instanceof File ? (
                    <p className="">{image.name.slice(0, 38)}</p>
                  ) : (
                    <p className="py-2">{image.slice(0, 38)}</p>
                  )}
                </div>
              </React.Fragment>
            ))}
          </>
        )}
      />

      <FormField
        control={form.control}
        name={`shops.${index}.video`}
        render={({ field, ...rest }) => (
          <>
            <FormItem>
              <FormLabel>
                <div className="flex flex-col py-2 mt-2 bg-brand-text-footer w-full text-white px-2 hover:bg-brand-text-customBlue">
                  <p>Add Video</p>
                  <p className="text-xs">
                    &quot; &quot;the size of the video must be less than 10mb
                  </p>
                </div>
              </FormLabel>
              <FormControl>
                <input
                  hidden
                  type="file"
                  accept="video/*"
                  key={field.value ? "yes" : "no"}
                  {...rest}
                  onChange={(event) => {
                    const selectedFile = event.target.files
                      ? event.target.files[0]
                      : null;
                    field.onChange(selectedFile);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
            {field.value !== null && form.getValues(`shops.${index}.video`) && (
              <div className="rounded-lg w-fit flex bg-slate-300 gap-2 pl-2 mb-1">
                <button
                  type="button"
                  className="hover:bg-blue-500 cursor-pointer rounded-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    field.onChange(null);
                  }}
                >
                  X
                </button>
                {field.value instanceof File ? (
                  <p className="">{field.value.name.slice(0, 38)}</p>
                ) : (
                  <p className="py-2">{String(field.value).slice(0, 38)}</p>
                )}
              </div>
            )}
          </>
        )}
      />

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

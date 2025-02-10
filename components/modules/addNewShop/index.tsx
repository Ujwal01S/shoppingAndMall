"use client";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { shopCategories } from "@/json_data/shops_category.json";
import React, { useEffect, useState } from "react";
import TimeRadio from "../shared/radio";
import { CirclePlus } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addShop, updateShop } from "@/lib/api";
import { AxiosProgressEvent } from "axios";
import { toast } from "react-toastify";
import { phoneRegex } from "@/schemas/mallSchema";
import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";
import { createNewShopFormData } from "@/lib/createNewShopData";
import { createFormSchema, formSchema } from "@/schemas/createShopSchema";

type AddNewShopComponentType = {
  name?: string;
  operation: "add" | "update";
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  shopName?: string;
  shopLevel?: string;
  shopDescription?: string;
  shopPhone?: string;
  shopCategory?: string;
  shopSubCategory?: string;
  shopOpenTime?: string;
  shopCloseTime?: string;
  images?: string[];
  id?: string;
  shopVideo?: string;
  mallOpenTime?: string;
  mallCloseTime?: string;
  level?: number;
};

const AddNewShopComponent = ({
  name,
  setOpen,
  operation,
  shopCategory,
  shopCloseTime,
  shopDescription,
  images,
  shopLevel,
  shopName,
  shopOpenTime,
  shopPhone,
  shopSubCategory,
  id,
  shopVideo,
  mallCloseTime,
  mallOpenTime,
  level,
}: AddNewShopComponentType) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(
      createFormSchema(level || 0, mallOpenTime || "", mallCloseTime || "")
    ),
  });

  const [category, setCategory] = useState<string>("");
  const [radioValue, setRadioValue] = useState<string>("everyDay");
  // const [shopImages, setShopImages] = useState<File[]>([]);
  const [prevImage, setPrevImage] = useState<(string | File)[]>([]);
  const [video, setVideo] = useState<string | File | undefined>(undefined);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    if (shopName) form.setValue("name", shopName);
    if (shopLevel) form.setValue("level", Number(shopLevel));
    if (shopPhone) form.setValue("phone", shopPhone);
    if (shopDescription) form.setValue("description", shopDescription);
    if (shopCategory) form.setValue("category", shopCategory);
    if (shopSubCategory) form.setValue("subCategory", shopSubCategory);
    if (shopOpenTime) form.setValue("openTime", shopOpenTime);
    if (shopCloseTime) form.setValue("closeTime", shopCloseTime);
    if (images) form.setValue("image", images);
    if (shopVideo) form.setValue("video", shopVideo);
    setCategory(shopCategory ?? "");
    setPrevImage(images ?? []);
    setVideo(shopVideo ?? undefined);
  }, [
    shopCategory,
    shopSubCategory,
    shopOpenTime,
    images,
    shopCloseTime,
    shopName,
    shopLevel,
    shopPhone,
    shopDescription,
    form,
    shopVideo,
  ]);

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let selectedFile;
    if (e.target.files) {
      selectedFile = e.target.files[0];
    }
    if (selectedFile) {
      setVideo(selectedFile);
      form.setValue("video", selectedFile);
    }
  };
  const removePrevImageHandler = (index: number) => {
    setPrevImage((prev) => {
      const updatedImage = prev.filter((_, imageIndex) => imageIndex !== index);
      form.setValue("image", updatedImage, {
        shouldValidate: true,
        shouldDirty: true,
      });
      return updatedImage;
    });
  };

  const handlePrevImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let selectedFile;
    if (e.target.files) {
      selectedFile = e.target.files[0];
    }
    if (selectedFile) {
      setPrevImage((prev) => {
        const updatedImage = [...prev, selectedFile];
        form.setValue("image", updatedImage, {
          shouldValidate: true,
          shouldDirty: true,
        });
        return updatedImage;
      });
    }
  };

  const queryClient = useQueryClient();

  const key = operation === "add" ? "mallwithshop" : "shop";

  function resetFunction() {
    form.reset();
  }

  const {
    mutate,
    isError: addError,
    isPending: addPending,
    isSuccess: addSuccess,
  } = useMutation({
    mutationFn: (shopData: FormData) => addShop(shopData, handleUploadProgress),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [key] });
      resetFunction();
      setOpen(false);
    },
  });

  const handleUploadProgress = (progressEvent: AxiosProgressEvent) => {
    const progress = Math.round(
      progressEvent.total
        ? (progressEvent.loaded * 100) / progressEvent.total
        : 0
    );

    setUploadProgress(progress);
  };

  // had to make sure that id does exist

  const {
    mutate: updateShopData,
    isPending: uploadPending,
    isSuccess: uploadSuccess,
  } = useMutation({
    mutationFn: ({ id, shopData }: { id: string; shopData: FormData }) => {
      if (!id) {
        throw new Error("ID is required for updating shop");
      }
      return updateShop(id, shopData, handleUploadProgress);
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: [key] });
      console.log("IDCheck", response.data.shopId);
      resetFunction();
      setUploadProgress(0);
      setOpen(false);
    },
  });

  const filteredCategory = shopCategories.filter(
    (shopCategory) => shopCategory.text === category
  );

  const onsubmit = (data: z.infer<typeof formSchema>) => {
    console.log({ data });
    if (operation === "add") {
      const shopFormData = createNewShopFormData(
        { ...data, video: data.video ?? undefined },
        name as string
      );
      mutate(shopFormData);
    }

    // make sure that id exists
    if (operation === "update") {
      const shopFormData = createNewShopFormData(
        { ...data, video: data.video ?? undefined },
        name as string
      );
      if (id) {
        updateShopData({ id, shopData: shopFormData });
      } else {
        console.error("ID is required for updating shop");
      }
    }
  };

  const tostMessage = addSuccess
    ? "Successfully added shop"
    : "Successfully Edited Shop";
  useEffect(() => {
    if (addSuccess || uploadSuccess) {
      toast.success(tostMessage, {
        position: "bottom-right",
      });
    }
  }, [addSuccess, uploadSuccess, tostMessage]);

  return (
    <DialogContent className="min-w-[38%] overflow-y-scroll scrollbarX max-h-[90dvh] tablet-md:max-h-screen">
      <DialogHeader className="border-b-2 py-2 items-start">
        <DialogTitle>
          {operation === "add" ? <p>Add New Shop</p> : <p>Update Shop</p>}
        </DialogTitle>
      </DialogHeader>
      <Form {...form}>
        <form
          className="flex flex-col justify-center gap-4  overflow-y-auto"
          onSubmit={form.handleSubmit(onsubmit)}
        >
          <div className="w-full flex gap-3 flex-wrap">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="w-[48%]">
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Name of Shop"
                      className="shadow-none border-brand-text-secondary focus-visible:ring-0 focus-visible:outline-2 focus-visible:outline-brand-text-customBlue h-10 focus:border-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="level"
              render={({ field }) => (
                <FormItem className="w-1/2">
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Level"
                      className="shadow-none border-brand-text-secondary focus-visible:ring-0 focus-visible:outline-2 focus-visible:outline-brand-text-customBlue h-10 focus:border-none"
                      onChange={(e) => {
                        const inputLevel = parseInt(e.target.value);
                        field.onChange(e.target.value);
                        if (level && inputLevel > level) {
                          form.setError("level", {
                            type: "Manual",
                            message: `The Level should be in range 0 - ${level}`,
                          });
                        } else {
                          form.clearErrors("level");
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
              name="phone"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Phone number"
                      className="shadow-none border-brand-text-secondary focus-visible:ring-0 focus-visible:outline-2 focus-visible:outline-brand-text-customBlue h-10 focus:border-none"
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === "" || phoneRegex.test(value)) {
                          field.onChange(value);
                          form.clearErrors(`phone`);
                        } else {
                          form.setError(`phone`, {
                            type: "manual",
                            message: "Please enter a valid phone number",
                          });
                        }
                      }}
                      onBlur={(e) => {
                        field.onBlur();
                        if (!phoneRegex.test(e.target.value)) {
                          form.setError("phone", {
                            type: "manual",
                            message: "Please enter a valid phone number",
                          });
                        } else {
                          form.clearErrors("phone");
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
              name="description"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Description"
                      className="shadow-none border-brand-text-secondary focus-visible:ring-0 focus-visible:outline-2 focus-visible:outline-brand-text-customBlue tablet-md:h-40 focus:border-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem className="w-full mobile-md:w-[48%] desktop-md:w-[32%]">
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
              name="subCategory"
              render={({ field }) => (
                <FormItem className="w-full mobile-md:w-[48%] desktop-md:w-[32%]">
                  <FormControl>
                    {filteredCategory[0]?.content.length > 0 ? (
                      <Select
                        value={field.value}
                        onValueChange={(value) => {
                          field.onChange(value);
                        }}
                      >
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
                                  {subCategory.content.map(
                                    (c, contentIndex) => (
                                      <SelectItem
                                        key={contentIndex}
                                        value={c.subContent}
                                      >
                                        {c.subContent}
                                      </SelectItem>
                                    )
                                  )}
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
          <p>
            Please note that the shop timing has to be under the range of mall
            timings.
          </p>

          <TimeRadio value={radioValue} setValue={setRadioValue} />

          <div className="flex flex-col tablet-sm:flex-row gap-1 w-full">
            <div className="flex flex-col w-full">
              <FormField
                control={form.control}
                name="openTime"
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
                              form.setError(`openTime`, {
                                type: "Manual",
                                message: `Shop cann't open before mall open time : (${mallOpenTime})`,
                              });
                            } else {
                              form.clearErrors(`openTime`);
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
                name="closeTime"
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

                            const shopCloseInMinute =
                              shopHour * 60 + shopMinute;
                            const mallCloseInMinute =
                              mallHour * 60 + mallMinute;

                            if (shopCloseInMinute > mallCloseInMinute) {
                              form.setError(`closeTime`, {
                                type: "Manual",
                                message: `Shop can't close after mall close time : (${mallCloseTime})`,
                              });
                            } else {
                              form.clearErrors(`closeTime`);
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

          <>
            <label className="flex items-center gap-1 text-brand-text-customBlue cursor-pointer">
              <p className="">Add Images</p>
              <CirclePlus size={18} />
              <FormField
                control={form.control}
                name="image"
                render={({ ...rest }) => (
                  <>
                    <FormItem>
                      <FormControl>
                        <input
                          hidden
                          type="file"
                          accept="image/jpeg"
                          key={prevImage.length}
                          {...rest}
                          onChange={(event) => {
                            handlePrevImageChange(event);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </>
                )}
              />
            </label>
            {prevImage.map((image, index) => (
              <React.Fragment key={index}>
                <div className="bg-slate-400 rounded-lg w-fit flex gap-2 pl-2">
                  <button
                    type="button"
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

            <label className="flex items-center gap-1 text-brand-text-customBlue cursor-pointer">
              <p className="">Add Video</p>
              <CirclePlus size={18} />
              <FormField
                control={form.control}
                name="video"
                render={({ ...rest }) => (
                  <>
                    <FormItem>
                      <FormControl>
                        <input
                          hidden
                          type="file"
                          accept="video/*"
                          key={video ? "yes" : "no"}
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
            <div className="bg-slate-400 rounded-lg w-fit flex gap-2 pl-2">
              {video && (
                <button
                  type="button"
                  className="hover:bg-blue-500 cursor-pointer"
                  onClick={() => {
                    setVideo(undefined);
                    form.setValue("video", undefined);
                  }}
                >
                  X
                </button>
              )}
              {video instanceof File ? (
                <p>{video.name.slice(0, 12)}</p>
              ) : (
                <p>{video?.slice(0, 12)}</p>
              )}
            </div>
          </>

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
          {uploadPending || addPending ? (
            <button
              type="submit"
              className="px-10 rounded text-white py-2 font-bold bg-slate-500"
            >
              {operation === "add" ? <p>Saving...</p> : <p>Updating...</p>}
            </button>
          ) : (
            <button
              type="submit"
              className="px-10 rounded text-white py-2 font-bold bg-brand-text-footer hover:bg-brand-text-customBlue w-fit"
            >
              {operation === "add" ? <p>Save</p> : <p>Update</p>}
            </button>
          )}
          {addError && <p className="text-red-500">Failed to add shop</p>}
        </form>
      </Form>
    </DialogContent>
  );
};

export default AddNewShopComponent;

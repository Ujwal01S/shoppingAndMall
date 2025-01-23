"use client";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
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
import EveryDayTimeComponent from "../shared/time/everyDay";
import { CirclePlus } from "lucide-react";
import { createShopFormData, ShopDataType } from "@/lib/createShopData";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addShop, updateShop } from "@/lib/api";

const formSchema = z.object({
  shopName: z.string().min(2, {
    message: "Name is required and character should be alteast 2 letter long",
  }),
  level: z.string({ message: "Level is required" }),
  phoneNumber: z.string().min(10).max(10, {
    message: "Phone is required min letter long and maximum of 10",
  }),
  description: z.string({ message: "Description is required" }),
  // category:z.string({message:"Category is required"})
});

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
}: AddNewShopComponentType) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    // defaultValues: {
    //   shopName: shopName ?? "",
    //   level: shopLevel ?? "",
    //   phoneNumber: shopPhone ?? "",
    //   description: shopDescription ?? "",
    // },
  });

  const [category, setCategory] = useState<string>("");
  const [subCategory, setSubCategory] = useState<string>("");
  const [radioValue, setRadioValue] = useState<string>("everyDay");
  const [openTime, setOpenTime] = useState<string | null>("");
  const [closeTime, setCloseTime] = useState<string | null>("");
  // const [shopImages, setShopImages] = useState<File[]>([]);
  const [prevImage, setPrevImage] = useState<(string | File)[]>([]);
  const [video, setVideo] = useState<string | File | undefined>(undefined);

  useEffect(() => {
    // in the current situation setting in default value is better because the data comes from parent component

    if (shopName) form.setValue("shopName", shopName);
    if (shopLevel) form.setValue("level", shopLevel);
    if (shopPhone) form.setValue("phoneNumber", shopPhone);
    if (shopDescription) form.setValue("description", shopDescription);

    setCategory(shopCategory ?? "");
    setSubCategory(shopSubCategory ?? "");
    setOpenTime(shopOpenTime ?? "");
    setCloseTime(shopCloseTime ?? "");
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

  // console.log(name);

  // console.log(operation);
  // console.log("From AddshopFrom", id);

  const handleOpenTime = (value: string | null) => {
    setOpenTime(value);
  };

  const handleCloseTime = (value: string | null) => {
    setCloseTime(value);
  };

  const handleCategoryChange = (value: string) => {
    setCategory(value);
  };

  const handleSubCategoryChange = (value: string) => {
    setSubCategory(value);
  };

  // const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   let selectedFile;
  //   if (e.target.files) {
  //     selectedFile = e.target.files[0];
  //   }
  //   if (selectedFile) {
  //     setShopImages((prev) => [...prev, selectedFile]);
  //   }
  // };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let selectedFile;
    if (e.target.files) {
      selectedFile = e.target.files[0];
    }
    if (selectedFile) {
      setVideo(selectedFile);
    }
  };

  // const removeImageHandler = (index: number) => {
  //   setShopImages((prev) =>
  //     prev.filter((_, imageIndex) => imageIndex !== index)
  //   );
  // };

  const removePrevImageHandler = (index: number) => {
    setPrevImage((prev) =>
      prev.filter((_, imageIndex) => imageIndex !== index)
    );
  };

  const handlePrevImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let selectedFile;
    if (e.target.files) {
      selectedFile = e.target.files[0];
    }
    if (selectedFile) {
      setPrevImage((prev) => [...prev, selectedFile]);
    }
  };

  const queryClient = useQueryClient();

  const key = operation === "add" ? "mallwithshop" : "shop";

  // console.log(shopImages);

  const { mutate, isError: addError } = useMutation({
    mutationFn: (shopData: FormData) => addShop(shopData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [key] });
    },
  });

  // had to make sure that id does exist

  const { mutate: updateShopData, isError: updateError } = useMutation({
    mutationFn: ({ id, shopData }: { id: string; shopData: FormData }) => {
      if (!id) {
        throw new Error("ID is required for updating shop");
      }
      return updateShop(id, shopData);
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: [key] });
      console.log("IDCheck", response.data.shopId);
    },
  });

  const filteredCategory = shopCategories.filter(
    (shopCategory) => shopCategory.text === category
  );

  const onsubmit = (data: z.infer<typeof formSchema>) => {
    if (operation === "add") {
      const updatedShopData: ShopDataType = {
        ...data,
        openTime,
        closeTime,
        category,
        image: prevImage,
        subCategory,
        nameOfMall: name,
        video: video,
      };
      const shopFormData = createShopFormData(updatedShopData);
      mutate(shopFormData);
    }

    // console.log(updatedShopData);

    // make sure that id exists
    if (operation === "update") {
      const updatedShopData: ShopDataType = {
        ...data,
        openTime,
        closeTime,
        category,
        image: prevImage,
        subCategory,
        nameOfMall: name,
        video: video,
      };
      const shopFormData = createShopFormData(updatedShopData);
      if (id) {
        updateShopData({ id, shopData: shopFormData });
      } else {
        console.error("ID is required for updating shop");
      }
    }

    if (!addError || !updateError) {
      setOpen(false);
    }
  };

  return (
    <DialogContent className="min-w-[38%] overflow-y-scroll scrollbarX max-h-screen">
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
              name="shopName"
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
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Phone number"
                      className="shadow-none border-brand-text-secondary focus-visible:ring-0 focus-visible:outline-2 focus-visible:outline-brand-text-customBlue h-10 focus:border-none"
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
                      className="shadow-none border-brand-text-secondary focus-visible:ring-0 focus-visible:outline-2 focus-visible:outline-brand-text-customBlue h-40 focus:border-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Select value={category} onValueChange={handleCategoryChange}>
              <SelectTrigger className="w-[49%]">
                <SelectValue placeholder={category ? category : "categories"} />
              </SelectTrigger>
              <SelectContent>
                {shopCategories.map((category, index) => (
                  <SelectItem key={index} value={category.text}>
                    {category.text}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {filteredCategory[0]?.content.length > 0 ? (
              <Select
                value={subCategory}
                onValueChange={handleSubCategoryChange}
              >
                <SelectTrigger className="w-[49%]">
                  <SelectValue
                    placeholder={subCategory ? subCategory : "SubCategories"}
                  />
                </SelectTrigger>
                <SelectContent>
                  {shopCategories.map((subCategory, index) => (
                    <React.Fragment key={index}>
                      {category === subCategory.text && (
                        <>
                          {subCategory.content.map((c, contentIndex) => (
                            <SelectItem key={contentIndex} value={c.subContent}>
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
              <p className="border-2 px-2 py-2 rounded-md text-sm w-[48%] text-brand-text-secondary">
                SubCategories
              </p>
            )}
          </div>
          <p>
            Please note that the shop timing has to be under the range of mall
            timings.
          </p>

          <TimeRadio value={radioValue} setValue={setRadioValue} />

          <EveryDayTimeComponent
            closeTime={closeTime}
            handleCloseTime={handleCloseTime}
            handleOpenTime={handleOpenTime}
            openTime={openTime}
          />

          {/* <label className="flex items-center gap-1 text-brand-text-customBlue cursor-pointer">
            <p className="">Add Images</p>
            <CirclePlus size={18} />
            <input
              type="file"
              hidden
              key={shopImages.length}
              onChange={handleImageChange}
            />
          </label> */}

          <>
            <label className="flex items-center gap-1 text-brand-text-customBlue cursor-pointer">
              <p className="">Add Images</p>
              <CirclePlus size={18} />
              <input
                type="file"
                hidden
                key={prevImage.length}
                onChange={handlePrevImageChange}
              />
            </label>
            {prevImage.map((image, index) => (
              <React.Fragment key={index}>
                <div className="bg-slate-400 rounded-lg w-fit flex gap-2 pl-2">
                  <button
                    className="hover:bg-blue-500 cursor-pointer"
                    onClick={() => removePrevImageHandler(index)}
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
              <input
                type="file"
                hidden
                accept="video/*"
                onChange={handleVideoChange}
              />
            </label>
            <div className="bg-slate-400 rounded-lg w-fit flex gap-2 pl-2">
              {video && (
                <button
                  className="hover:bg-blue-500 cursor-pointer"
                  onClick={() => setVideo("")}
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

          <button
            type="submit"
            className="px-10 rounded text-white py-2 font-bold bg-brand-text-footer hover:bg-brand-text-customBlue w-fit"
          >
            {operation === "add" ? <p>Save</p> : <p>Update</p>}
          </button>
          {addError && <p className="text-red-500">Failed to add shop</p>}
        </form>
      </Form>
    </DialogContent>
  );
};

export default AddNewShopComponent;

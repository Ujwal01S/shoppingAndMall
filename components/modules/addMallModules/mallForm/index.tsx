"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CirclePlus, ImageUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChangeEvent, useContext, useEffect, useState } from "react";
import AddShopForm from "../addShop";
import TimeRadio from "../../shared/radio";
import axios, { AxiosProgressEvent } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createShopFormData } from "@/lib/createShopData";
import { ShopDataContext } from "@/store/editShopContext";
import { BASE_API_URL } from "@/lib/constant";
import { redirect, useRouter } from "next/navigation";
import { Progress } from "@/components/ui/progress";
import { toast } from "react-toastify";
import TimePicker from "react-time-picker";

const phoneRegex = new RegExp(
  /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
);

export const formSchema = z.object({
  name: z.string().min(2, {
    message: "Shop name must be at least 2 characters.",
  }),
  address: z
    .string()
    .min(2, { message: "Address field must be atleast 2 characters" }),
  level: z.coerce.number().min(1, { message: "Level is required" }),
  phone: z
    .string()
    .min(10, { message: "Phone number contain at least 10 characters" })
    .regex(phoneRegex, { message: "Please enter valid Number!" }),
  image: z.union(
    [
      z.instanceof(File, { message: "Image is required" }),
      z.string().min(1, { message: "Image URL is required" }),
    ],
    {
      required_error: "Image is required",
      invalid_type_error: "Must be a file or image URL",
    }
  ),
  openTime: z
    .string({ message: "Open Time is required" })
    .min(1, { message: "Open time is required" })
    .refine(
      (time) => {
        const openHour = parseInt(time.split(":")[0]);
        return openHour > 6;
      },
      {
        message: "Open time must be before 6 AM",
      }
    ),
  closeTime: z
    .string({ message: "Close Time is required" })
    .min(1, { message: "Close time is required" })
    .refine(
      (time) => {
        const closeHour = parseInt(time.split(":")[0]);
        return closeHour > 23;
      },
      {
        message: "Close time must be before 11 PM",
      }
    ),
});

const postMallData = async (
  MallFormData: FormData,
  onUploadProgress: (progressEvent: AxiosProgressEvent) => void
) => {
  const response = await axios.post(`${BASE_API_URL}/api/mall`, MallFormData, {
    onUploadProgress,
  });
  return response;
};

const postShopData = async (
  shopData: FormData,
  onUploadProgress: (progressEvent: AxiosProgressEvent) => void
) => {
  const response = await axios.post(`${BASE_API_URL}/api/shop`, shopData, {
    onUploadProgress,
  });
  return response;
};

const MallForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      address: "",
      phone: "",
      level: 0,
      openTime: "",
      closeTime: "",
      image: undefined,
    },
  });

  const { ctxShopData, setCtxShopData } = useContext(ShopDataContext);

  // console.log("From mallForm:", ctxShopData);

  const queryClient = useQueryClient();

  const [radioValue, setRadioValue] = useState<string>("everyDay");

  // mallData state from useForm
  const [mallData, setMallData] = useState<{
    name: string;
    address: string;
    level: number;
    phone: string;
  }>();

  // clock state
  const [openTime, setOpenTime] = useState<string | null>("");
  const [closeTime, setCloseTime] = useState<string | null>("");

  const [mallImage, setMallImage] = useState<File | null>(null);
  const [shopId, setshopId] = useState<string[]>([]);
  const [mallName, setMallName] = useState<string>("");

  const router = useRouter();

  const handleOpenTime = (value: string | null) => {
    setOpenTime(value);
    form.setValue("openTime", value as string);
  };

  const handleCloseTime = (value: string | null) => {
    setCloseTime(value);
    form.setValue("closeTime", value as string);
  };

  const [uploadProgressMap, setUploadProgressMap] = useState<{
    mall: number;
    shops: { [key: number]: number };
  }>({
    mall: 0,
    shops: {},
  });

  const handleUploadProgress = (progressEvent: AxiosProgressEvent) => {
    const progress = Math.round(
      progressEvent.total
        ? (progressEvent.loaded * 100) / progressEvent.total
        : 0
    );

    setUploadProgressMap((prev) => ({
      ...prev,
      mall: progress,
    }));
  };

  const handleShopUploadProgress = (
    index: number,
    progressEvent: AxiosProgressEvent
  ) => {
    const progress = Math.round(
      progressEvent.total
        ? (progressEvent.loaded * 100) / progressEvent.total
        : 0
    );

    setUploadProgressMap((prev) => ({
      ...prev,
      shops: {
        ...prev.shops,
        [index]: progress,
      },
    }));
  };

  const {
    mutate: mutateMall,
    isError: mallUpdateError,
    isPending: mallPending,
  } = useMutation({
    mutationFn: (MallFormData: FormData) =>
      postMallData(MallFormData, handleUploadProgress),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mall"] });
      toast.success("Mall successfully added!!", {
        position: "bottom-right",
      });
      form.reset();
      router.push("/admin/dashboard");
    },
    onError: () => {
      toast.error("Error while adding mall!", {
        position: "bottom-right",
      });
    },
  });
  const { mutate: mutateShop, isPending: shopPending } = useMutation({
    mutationFn: ({
      shopFormData,
      index,
    }: {
      shopFormData: FormData;
      index: number;
    }) =>
      postShopData(shopFormData, (progressEvent) =>
        handleShopUploadProgress(index, progressEvent)
      ),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["shop"] });
      setshopId((prev) => [...prev, response.data.shopId]);
    },
  });

  const handleMallImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setMallImage(file);
      form.setValue("image", file);
    }
  };

  const onsubmit = (data: z.infer<typeof formSchema>) => {
    console.log({ data });
    ctxShopData.map((shop, shopIndex) => {
      const shopFormData = createShopFormData(shop);
      mutateShop({ shopFormData: shopFormData, index: shopIndex });
    });
    setMallData(data);

    if (ctxShopData.length === 0) {
      const formData = new FormData();
      formData.append("name", data?.name as string);
      formData.append("address", data?.address as string);
      formData.append("level", data?.level.toString());
      formData.append("phone", data?.phone as string);
      formData.append("openTime", openTime as string | Blob);
      formData.append("closeTime", closeTime as string | Blob);
      formData.append("image", mallImage as string | Blob);
      mutateMall(formData);
    }
    // console.log(data);
    // console.log("Shop Data:", ctxShopData);
    // console.log("From Submit:", shopData);
  };

  // console.log({ uploadProgressMap });

  useEffect(() => {
    if (
      shopId &&
      shopId.length === ctxShopData.length &&
      ctxShopData.length > 0
    ) {
      const formData = new FormData();
      formData.append("name", mallData?.name as string);
      formData.append("address", mallData?.address as string);
      formData.append("level", mallData?.level?.toString() || "");
      formData.append("phone", mallData?.phone as string);
      formData.append("openTime", openTime as string | Blob);
      formData.append("closeTime", closeTime as string | Blob);
      formData.append("image", mallImage as string | Blob);

      shopId.forEach((id) => {
        formData.append("shopId", id as string);
      });

      setshopId([]);
      setCtxShopData([]);
      mutateMall(formData);
      if (!mallUpdateError) {
        redirect("/admin/dashboard");
      }
    }
  }, [
    shopId,
    mallData,
    closeTime,
    openTime,
    mallImage,
    mutateMall,
    ctxShopData,
    setCtxShopData,
    mallUpdateError,
  ]);

  const [counter, setCounter] = useState<number>(0);

  // console.log(mallName);

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onsubmit)}
          className="flex flex-col justify-center gap-4"
        >
          <div className="w-full flex gap-3 flex-wrap">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="w-full mobile-md:w-[48%] desktop-md:w-[32%]">
                  <FormControl>
                    <Input
                      onChangeCapture={(e) =>
                        setMallName(e.currentTarget.value)
                      }
                      className="shadow-none border-brand-text-secondary focus-visible:ring-0 focus-visible:outline-2 focus-visible:outline-brand-text-customBlue focus:border-none"
                      placeholder="Name of Mall"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem className="w-full mobile-md:w-[48%] desktop-md:w-[32%]">
                  <FormControl>
                    <Input
                      className="shadow-none border-brand-text-secondary focus-visible:ring-0 focus-visible:outline-2 focus-visible:outline-brand-text-customBlue focus:border-none"
                      placeholder="Address"
                      {...field}
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
                <FormItem className="w-full mobile-md:w-[48%] desktop-md:w-[32%]">
                  <FormControl>
                    <Input
                      className="shadow-none border-brand-text-secondary focus-visible:ring-0 focus-visible:outline-2 focus-visible:outline-brand-text-customBlue focus:border-none"
                      placeholder="Level"
                      {...field}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        field.onChange(value);
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
                <FormItem className="w-full mobile-md:w-[48%] desktop-md:w-[32%]">
                  <FormControl>
                    <Input
                      className="shadow-none border-brand-text-secondary focus-visible:ring-0 focus-visible:outline-2 focus-visible:outline-brand-text-customBlue focus:border-none"
                      placeholder="Phone Number"
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === "" || phoneRegex.test(value)) {
                          field.onChange(value);
                          form.clearErrors("phone");
                        } else {
                          form.setError("phone", {
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
            <label className="flex flex-col text-green-600 cursor-pointer hover:text-[#EFB6B2]">
              <ImageUp size={24} />
              <p className="text-xs">
                {"("}Add Image{")"}
              </p>

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
              <p>{mallImage?.name.slice(0, 12)}</p>
            </label>
            {/* <label className="flex flex-col text-green-600 cursor-pointer hover:text-[#EFB6B2]">
              <ImageUp size={24} />
              <p className="text-xs">
                {"("}Add Image{")"}
              </p>
              <input type="file" hidden onChange={handleMallImageChange} />
            </label>
            <p>{mallImage?.name.slice(0, 12)}</p> */}
          </div>

          <div>
            <p className="text-brand-text-secondary">
              Please note that the mall cannot open before 6am and should be
              closed before 11pm.
            </p>
          </div>

          <TimeRadio value={radioValue} setValue={setRadioValue} />

          <div className="flex flex-col tablet-sm:flex-row gap-1 w-full">
            <div className="flex flex-col w-full">
              <FormField
                control={form.control}
                name="openTime"
                render={({}) => (
                  <FormItem className="flex flex-col w-full">
                    <FormLabel>Open Time:</FormLabel>
                    <FormControl>
                      <TimePicker
                        className="w-1/2"
                        value={openTime}
                        onChange={handleOpenTime}
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
                render={({}) => (
                  <FormItem className="flex flex-col w-full">
                    <FormLabel>Close Time:</FormLabel>
                    <FormControl>
                      <TimePicker
                        className="w-1/2"
                        value={closeTime}
                        onChange={handleCloseTime}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <p className="font-semibold text-brand-text-secondary text-lg w-full border-b-2">
            Shop
          </p>

          {Array.from(Array(counter)).map((c, index: number) => {
            return (
              <AddShopForm
                key={index}
                index={index}
                setCounter={setCounter}
                counter={counter}
                mallName={mallName}
                uploadProgress={uploadProgressMap.shops[index] || 0}
              />
            );
          })}

          <button
            onClick={() => setCounter(counter + 1)}
            type="button"
            className="w-fit items-center flex gap-2 bg-brand-text-footer text-white font-semibold px-4 py-2 rounded-md"
          >
            <CirclePlus size={24} />
            Add Shop
          </button>

          {uploadProgressMap.mall > 0 && (
            <div className="w-full">
              <p className="text-lg text-brand-text-tertiary">
                Progress: {uploadProgressMap.mall}%
              </p>
              <Progress
                value={uploadProgressMap.mall}
                max={100}
                className="w-full h-4"
                indicatorClassName="bg-green-600"
              />
            </div>
          )}

          <div className="flex w-full justify-center mt-20">
            {mallPending || shopPending ? (
              <Button
                variant="signin"
                className="w-fit px-12 py-2 rounded-md font-semibold text-white bg-slate-600"
              >
                Saving...
              </Button>
            ) : (
              <Button
                type="submit"
                variant="signin"
                className="w-fit px-12 py-2 rounded-md font-semibold text-white bg-brand-text-footer hover:bg-brand-text-customBlue"
              >
                Save
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
};

export default MallForm;

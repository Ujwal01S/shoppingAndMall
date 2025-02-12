"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
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
import { BASE_API_URL } from "@/lib/constant";
import { useEffect, useState } from "react";
import TimePicker from "react-time-picker";
import {
  createFormShopSchemaArray,
  mallShopFormSchema,
} from "@/schemas/shopSchema";
import TimeRadio from "../../shared/radio";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosProgressEvent } from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

import { Progress } from "@/components/ui/progress";
import { mallSchema, phoneRegex } from "@/schemas/mallSchema";
import { createNewShopFormData } from "@/lib/createNewShopData";
import AddShopForm from "../addShop";
import { createMallSchema } from "@/schemas/createMallSchema";

const postMallData = async (
  MallFormData: FormData,
  onUploadProgress: (progressEvent: AxiosProgressEvent) => void
) => {
  try {
    axios
      .post(`${BASE_API_URL}/api/mall`, MallFormData, {
        onUploadProgress,
      })
      .then((response) => {
        return response;
      });
  } catch (error) {
    throw error;
  }
};

const postShopData = async (
  shopData: FormData,
  onUploadProgress: (progressEvent: AxiosProgressEvent) => void
) => {
  const response = await axios.post(`${BASE_API_URL}/api/shop`, shopData, {
    onUploadProgress,
    // maxContentLength: Infinity,
    // maxBodyLength: Infinity,
  });
  return response;
};

const MallForm = () => {
  const [radioValue, setRadioValue] = useState<string>("everyDay");
  const [mallImage, setMallImage] = useState<File | null>(null);
  const [shopId, setshopId] = useState<string[]>([]);
  const [mallData, setMallData] = useState<z.infer<typeof mallSchema> | null>(
    null
  );
  const [lengthOfShop, setLengthOfShop] = useState<number>(0);

  const [uploadProgressMap, setUploadProgressMap] = useState<{
    mall: number;
    shops: { [key: number]: number };
    total: number;
  }>({
    mall: 0,
    shops: {},
    total: 0,
  });

  // console.log({ uploadProgressMap });

  const initialCheck = {
    level: 0,
    openTime: "",
    closeTime: "",
  };

  const [dynamicCheck, setDynamicCheck] = useState(initialCheck);
  const router = useRouter();

  const handleMallImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setMallImage(file);
      form.setValue("mall.image", file);
    }
  };
  type MallFormData = z.infer<typeof mallShopFormSchema>;

  const form = useForm<MallFormData>({
    resolver: zodResolver(
      z.object({
        mall: createMallSchema(dynamicCheck.closeTime || ""),
        shops: createFormShopSchemaArray(
          dynamicCheck.level || 0,
          dynamicCheck.openTime || "",
          dynamicCheck.closeTime || ""
        ),
      })
    ),
    defaultValues: {
      mall: {},
      shops: [],
    },
  });

  const [mallOpenTime, mallCloseTime, mallLevel] = form.watch([
    "mall.openTime",
    "mall.closeTime",
    "mall.level",
  ]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "shops",
  });

  useEffect(() => {
    setDynamicCheck((dynamicCheck) => ({
      ...dynamicCheck,
      level: mallLevel,
      closeTime: mallCloseTime,
      openTime: mallOpenTime,
    }));
  }, [mallCloseTime, mallOpenTime, mallLevel]);

  const queryClient = useQueryClient();

  // query

  const { mutate: mutateMall, isPending: mallPending } = useMutation({
    mutationFn: (formData: FormData) =>
      postMallData(formData, handleUploadProgress),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["category"] });
      queryClient.invalidateQueries({ queryKey: ["mall"] });
      toast.success("Mall successfully added!!", {
        position: "bottom-right",
      });

      router.push("/admin/dashboard");
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
      postShopData(shopFormData, (progressEvent) => {
        console.log(progressEvent);
        return handleShopUploadProgress(index, progressEvent);
      }),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["category"] });
      queryClient.invalidateQueries({ queryKey: ["shop"] });
      setshopId((prev) => [...prev, response.data.shopId]);
    },
  });

  // progressBar

  const handleUploadProgress = (progressEvent: AxiosProgressEvent) => {
    if (progressEvent.total) {
      const progress = (progressEvent.loaded / progressEvent.total) * 100;

      setUploadProgressMap((prev) => {
        const shopProgresses = Object.values(prev.shops);
        const averageShopProgress = shopProgresses.length
          ? shopProgresses.reduce((a, b) => a + b, 0) / shopProgresses.length
          : 0;

        const totalProgress = (averageShopProgress + progress) / 2;

        return {
          ...prev,
          mall: progress,
          total: parseFloat(totalProgress.toFixed(2)),
        };
      });
    }
  };

  const handleShopUploadProgress = (
    index: number,
    progressEvent: AxiosProgressEvent
  ) => {
    console.log({ index, progressEvent }, "from handleShopUploadProgress");
    if (progressEvent.total) {
      const progress = (progressEvent.loaded / progressEvent.total) * 100;

      setUploadProgressMap((prev) => {
        const updatedShops = {
          ...prev.shops,
          [index]: progress,
        };

        const shopProgresses = Object.values(updatedShops);
        const averageShopProgress = shopProgresses.length
          ? shopProgresses.reduce((a, b) => a + b, 0) / shopProgresses.length
          : 0;

        const totalProgress = (averageShopProgress + prev.mall) / 2;

        return {
          ...prev,
          shops: updatedShops,
          total: parseFloat(totalProgress.toFixed(2)),
        };
      });
    }
  };

  // console.log({ mallImage });

  const onSubmit = async (data: z.infer<typeof mallShopFormSchema>) => {
    // console.log("Form Data:", data);
    setLengthOfShop(data.shops.length);
    setMallData(data.mall);
    const formData = new FormData();

    // Append mall fields to formData
    formData.append("name", data.mall.name);
    formData.append("address", data.mall.address);
    formData.append("level", data.mall.level.toString());
    formData.append("phone", data.mall.phone);
    formData.append("openTime", data.mall.openTime);
    formData.append("closeTime", data.mall.closeTime);
    formData.append("image", data.mall.image);

    if (data.shops.length === 0 && shopId.length === 0) {
      mutateMall(formData);
      form.reset();
    }

    data.shops.map((shop, shopIndex) => {
      const shopFormData = createNewShopFormData(
        {
          ...shop,
          video: Array.isArray(shop.video)
            ? shop.video.filter((v): v is string | File => v !== undefined)
            : shop.video
            ? [shop.video]
            : undefined,
        },
        data.mall.name
      );
      mutateShop({ shopFormData, index: shopIndex });
    });
  };

  useEffect(() => {
    if (shopId && shopId.length === lengthOfShop && lengthOfShop > 0) {
      const formData = new FormData();
      if (mallData) {
        formData.append("name", mallData.name);
        formData.append("address", mallData?.address);
        formData.append("level", mallData.level.toString());
        formData.append("phone", mallData.phone);
        formData.append("openTime", mallData.openTime);
        formData.append("closeTime", mallData.closeTime);
        formData.append("image", mallData.image);
      }

      shopId.forEach((id) => {
        formData.append("shopId", id as string);
      });
      mutateMall(formData);
    }
  }, [shopId, lengthOfShop, mallData, mutateMall, form]);

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col justify-center gap-4"
        >
          <div className="w-full flex gap-3 flex-wrap">
            <FormField
              control={form.control}
              name="mall.name"
              render={({ field }) => (
                <FormItem className="w-full mobile-md:w-[48%] desktop-md:w-[32%]">
                  <FormControl>
                    <Input
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
              name="mall.address"
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
              name="mall.level"
              render={({ field }) => (
                <FormItem className="w-full mobile-md:w-[48%] desktop-md:w-[32%]">
                  <FormControl>
                    <Input
                      className="shadow-none border-brand-text-secondary focus-visible:ring-0 focus-visible:outline-2 focus-visible:outline-brand-text-customBlue focus:border-none"
                      placeholder="Level"
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value;
                        const numericValue = parseInt(value);

                        if (value === "") {
                          field.onChange("");
                          form.clearErrors("mall.level");
                        } else if (isNaN(numericValue)) {
                          field.onChange(value);
                          form.setError("mall.level", {
                            type: "manual",
                            message: "Please enter a valid number",
                          });
                        } else {
                          field.onChange(numericValue);
                          form.clearErrors("mall.level");
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
              name="mall.phone"
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
                          form.clearErrors("mall.phone");
                        } else {
                          form.setError("mall.phone", {
                            type: "manual",
                            message: "Please enter a valid phone number",
                          });
                        }
                      }}
                      onBlur={(e) => {
                        field.onBlur();
                        if (!phoneRegex.test(e.target.value)) {
                          form.setError("mall.phone", {
                            type: "manual",
                            message: "Please enter a valid phone number",
                          });
                        } else {
                          form.clearErrors("mall.phone");
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
                name="mall.image"
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
                name="mall.openTime"
                render={({ field }) => (
                  <FormItem className="flex flex-col w-full">
                    <FormLabel>Open Time:</FormLabel>
                    <FormControl>
                      <TimePicker
                        className="w-1/2"
                        value={field.value}
                        onChange={(value) => {
                          const shopOpen = value;
                          field.onChange(value);
                          if (mallCloseTime && shopOpen) {
                            const [openHours, openMinutes] = shopOpen
                              .split(":")
                              .map(Number);
                            const [closeHours, closeMinutes] = mallCloseTime
                              .split(":")
                              .map(Number);

                            const openTimeInMinutes =
                              openHours * 60 + openMinutes;
                            const closeTimeInMinutes =
                              closeHours * 60 + closeMinutes;

                            if (closeTimeInMinutes - openTimeInMinutes >= 60) {
                              form.setError("mall.openTime", {
                                type: "Manual",
                                message:
                                  "Open Time must be atleast 1 hour earlier than closing time",
                              });
                            } else {
                              form.clearErrors("mall.openTime");
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
                name="mall.closeTime"
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

          <p className="font-semibold text-brand-text-secondary text-lg w-full border-b-2">
            Shop
          </p>

          {fields.map((shop, index) => (
            <AddShopForm
              key={shop.id}
              index={index}
              uploadProgress={uploadProgressMap.shops[index] || 0}
              remove={remove}
              form={form}
              mallOpenTime={mallOpenTime}
              mallCloseTime={mallCloseTime}
              mallLevel={mallLevel}
            />
          ))}

          <Button
            type="button"
            className="w-fit items-center flex gap-2 bg-brand-text-footer text-white font-semibold px-4 py-2 rounded-md"
            onClick={() =>
              append({
                name: "",
                image: [],
                level: 0,
                description: "",
                video: null,
                subCategory: "",
                phone: "",
                openTime: "",
                closeTime: "",
                category: "",
              })
            }
          >
            <CirclePlus size={24} /> Add Shop
          </Button>

          {uploadProgressMap.total > 0 && (
            <div className="w-full">
              <p className="text-lg text-brand-text-tertiary">
                Total Progress: {uploadProgressMap.total}%
              </p>
              <Progress
                value={uploadProgressMap.total}
                max={100}
                className="w-full h-4"
                indicatorClassName="bg-green-500 transition-all duration-200"
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

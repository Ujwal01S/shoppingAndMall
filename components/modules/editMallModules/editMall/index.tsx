"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
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
import { CirclePlus, ImageUp, X } from "lucide-react";
import TimeRadio from "../../shared/radio";
import { useEffect, useState } from "react";
import { EventButton } from "../../shared/normalButton";
import EditAddShopForm from "../addShopFormEdit";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addShop, updateMallByName, updateShop } from "@/lib/api";
import { AxiosProgressEvent } from "axios";
import { Progress } from "@/components/ui/progress";
import { toast } from "react-toastify";
import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";
import { useRouter } from "next/navigation";
import { mallSchema, phoneRegex } from "@/schemas/mallSchema";
import {
  createFormShopSchemaArray,
  mallShopFormSchema,
  shopSchema,
} from "@/schemas/shopSchema";
import { Button } from "@/components/ui/button";
import { createNewShopFormData } from "@/lib/createNewShopData";

type MallDataType = z.infer<typeof mallSchema>;

type FinalMallData = Omit<MallDataType, "image"> & {
  imageUrl: string;
  _id: string;
};

export type FinalShop = z.infer<typeof shopSchema> & { _id: string };

type MallType = FinalMallData & {
  shops: FinalShop[];
};

type EditMallFormType = {
  nameOfMall: string;
  mallDataApi: MallType;
};

const EditMallForm = ({ mallDataApi }: EditMallFormType) => {
  const [radioValue, setRadioValue] = useState<string>("everyDay");
  const [mallImage, setMallImage] = useState<string | File | null>(null);
  const [shopId, setshopId] = useState<string[]>([]);
  const [lengthOfShop, setLengthOfShop] = useState<number>(0);
  const [mallData, setMallData] = useState<z.infer<typeof mallSchema> | null>(
    null
  );

  const initialCheck = {
    level: 0,
    openTime: "",
    closeTime: "",
  };

  // console.log({ mallDataApi: mallDataApi.shops });

  const [dynamicCheck, setDynamicCheck] = useState(initialCheck);

  const queryClient = useQueryClient();

  const [uploadProgressMap, setUploadProgressMap] = useState<{
    mall: number;
    shops: { [key: number]: number };
    total: number;
  }>({
    mall: 0,
    shops: {},
    total: 0,
  });

  const router = useRouter();

  const handleShopUploadProgress = (
    index: number,
    progressEvent: AxiosProgressEvent
  ) => {
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

  // isError use garera route garyo ki update ma error aucha

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

  const { mutate: updateMall, isPending: mallUpdating } = useMutation({
    mutationFn: ({ mallData }: { mallData: FormData }) => {
      if (!mallDataApi._id) {
        throw new Error("ID is required to update");
      }
      // console.log("MallID:", mallDataApi._id);
      return updateMallByName(mallDataApi._id, mallData, handleUploadProgress);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mall"] });
      // queryClient.invalidateQueries({ queryKey: ["category"] });
      toast.success("Successfully Edited Mall", {
        position: "bottom-right",
      });
      router.back();
    },
  });

  const { mutate: updateShopData, isPending: shopUpdating } = useMutation({
    mutationFn: ({
      id,
      shopData,
      index,
    }: {
      id: string;
      shopData: FormData;
      index: number;
    }) => {
      if (!id) {
        throw new Error("ID is required for updating shop");
      }

      return updateShop(id, shopData, (progressEvent) =>
        handleShopUploadProgress(index, progressEvent)
      );
    },
    onSuccess: (response) => {
      const newShopId = response.data.shopId;
      // console.log("ShopID before update:", shopId);
      setshopId((prev) => {
        const updated = [...prev, newShopId];
        // console.log("ShopID after update:", updated);
        return updated;
      });
      queryClient.invalidateQueries({ queryKey: ["shop"] });
      // queryClient.invalidateQueries({ queryKey: ["category"] });
    },
  });

  const { mutate: addShopMutate, isPending: shopAdding } = useMutation({
    mutationFn: ({ shopData, index }: { shopData: FormData; index: number }) =>
      addShop(shopData, (progressEvent) =>
        handleShopUploadProgress(index, progressEvent)
      ),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["shop"] });
      // queryClient.invalidateQueries({ queryKey: ["category"] });
      setshopId((prev) => [...prev, response.data.shopId]);
      // console.log("ShopIDFromAdd:", response.data.shopId);
    },
  });

  const form = useForm<z.infer<typeof mallShopFormSchema>>({
    resolver: zodResolver(
      z.object({
        mall: mallSchema,
        shops: createFormShopSchemaArray(
          dynamicCheck?.level || 0,
          dynamicCheck?.openTime || "",
          dynamicCheck?.closeTime || ""
        ),
      })
    ),
    defaultValues: {
      mall: {
        name: mallDataApi?.name,
        address: mallDataApi?.address,
        closeTime: mallDataApi?.closeTime,
        image: mallDataApi?.imageUrl,
        level: mallDataApi?.level,
        openTime: mallDataApi?.openTime,
        phone: mallDataApi?.phone,
      },
      shops: [...mallDataApi?.shops],
    },
  });

  const [mallOpenTime, mallCloseTime, mallLevel] = form.watch([
    "mall.openTime",
    "mall.closeTime",
    "mall.level",
  ]);

  useEffect(() => {
    setDynamicCheck((dynamicCheck) => ({
      ...dynamicCheck,
      level: mallLevel,
      closeTime: mallCloseTime,
      openTime: mallOpenTime,
    }));
  }, [mallCloseTime, mallOpenTime, mallLevel]);

  const onsubmit = (data: z.infer<typeof mallShopFormSchema>) => {
    // console.log({ data });
    setMallData(data.mall);
    setLengthOfShop(data.shops.length);
    data.shops.map((shopData, shopInx) => {
      const shopFormData = createNewShopFormData(
        { ...shopData, video: shopData.video ?? undefined },
        data?.mall.name
      );
      if (shopData._id) {
        // console.log("uid Exists", { shopFormData });
        updateShopData({
          id: shopData._id,
          shopData: shopFormData,
          index: shopInx,
        });
      } else {
        // console.log("UID doesn;t exits", { shopFormData });
        addShopMutate({ shopData: shopFormData, index: shopInx });
      }
    });

    if (data.shops.length === 0) {
      const formData = new FormData();
      formData.append("name", data.mall.name);
      formData.append("address", data.mall.address);
      formData.append("level", data.mall.level.toString());
      formData.append("phone", data.mall.phone);
      formData.append("openTime", data.mall.openTime);
      formData.append("closeTime", data.mall.closeTime);
      formData.append("image", data.mall.image);
      updateMall({ mallData: formData });
    }
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

        shopId.forEach((id) => {
          formData.append("shopId", id as string);
        });
      }

      updateMall({ mallData: formData });
      setshopId([]);
    }
  }, [shopId, lengthOfShop, updateMall, mallData]);

  useEffect(() => {
    setMallImage(mallDataApi?.imageUrl);
  }, [mallDataApi]);

  const handleMallImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let selectedFile;
    if (e.target.files) {
      selectedFile = e.target.files[0];
      setMallImage(selectedFile);
      form.setValue("mall.image", selectedFile);
    }
  };

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "shops",
  });

  console.log({ uploadProgressMap });

  return (
    <div className="tablet-md:w-[60%] border-2 shadow-lg rounded-md px-4 py-6">
      <Form {...form}>
        <form
          className="flex flex-col justify-center gap-4"
          onSubmit={form.handleSubmit(onsubmit)}
        >
          <div className="w-full flex gap-4 flex-wrap">
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
            </label>
            {/* mall image name */}
            {mallImage && (
              <span className="bg-slate-400 flex gap-1 rounded-full items-center px-1">
                <X onClick={() => setMallImage(null)} />
                {mallImage instanceof File ? (
                  <p>{mallImage.name.slice(0, 30)}</p>
                ) : (
                  <p>{mallImage?.slice(0, 30)}</p>
                )}
              </span>
            )}
          </div>

          <p>
            Please note that the mall cannot open before 6 am and should be
            closed before 11pm
          </p>

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
          {fields.map((shop, index) => (
            <EditAddShopForm
              key={shop.id}
              index={index}
              uploadProgress={uploadProgressMap.shops[index] || 0}
              remove={remove}
              form={form}
              mallCloseTime={mallCloseTime}
              mallOpenTime={mallOpenTime}
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
                _id: "",
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

          <div className="mt-20 w-full flex justify-center">
            {mallUpdating || shopUpdating || shopAdding ? (
              <EventButton
                content="Updating..."
                className="font-semibold px-10 bg-slate-600"
              />
            ) : (
              <EventButton
                content="Update"
                className="font-semibold px-10"
                type="submit"
              />
            )}
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EditMallForm;

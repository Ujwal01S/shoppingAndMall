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
import { CirclePlus, ImageUp, X } from "lucide-react";
import TimeRadio from "../../shared/radio";
import { useContext, useEffect, useState } from "react";
import { EventButton } from "../../shared/normalButton";
import EditAddShopForm from "../addShopFormEdit";
import { ShopDataContext } from "@/store/editShopContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addShop,
  getMallByName,
  updateMallByName,
  updateShop,
} from "@/lib/api";
import { createShopFormData } from "@/lib/createShopData";
import { redirect } from "next/navigation";
import FormLoader from "../../shared/loadingSkeleton/formLoader";
import { AxiosProgressEvent } from "axios";
import { Progress } from "@/components/ui/progress";
import { toast } from "react-toastify";
import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  address: z.string().min(1, "Address is required"),
  phone: z.string().min(1, "Phone number is required"),
  level: z.string().min(0, "Level must be a positive number"),
  openTime: z.string().optional(),
  closeTime: z.string().optional(),
  image: z.any().optional(),
});

type EditMallFormType = {
  nameOfMall: string;
};

const EditMallForm = ({ nameOfMall }: EditMallFormType) => {
  const { ctxShopData, setCtxShopData } = useContext(ShopDataContext);
  const [radioValue, setRadioValue] = useState<string>("everyDay");
  const [addShopCounter, setAddShopCounter] = useState<number>(0);

  const [openTime, setOpenTime] = useState<string | null>("");
  const [closeTime, setCloseTime] = useState<string | null>("");
  const [mallImage, setMallImage] = useState<string | File | null>(null);
  const [shopId, setshopId] = useState<string[]>([]);

  const [mallData, setMallData] = useState<{
    name: string;
    address: string;
    level: number;
    phone: string;
  }>();

  const queryClient = useQueryClient();
  const handleOpenTime = (value: string | null) => {
    setOpenTime(value);
    form.setValue("openTime", value as string);
  };

  const handleCloseTime = (value: string | null) => {
    setCloseTime(value);
    form.setValue("closeTime", value as string);
  };

  const [updatedMall, setUpdatedMall] = useState<string>("");

  const [uploadProgressMap, setUploadProgressMap] = useState<{
    mall: number;
    shops: { [key: number]: number };
  }>({
    mall: 0,
    shops: {},
  });

  const router = useRouter();

  console.log(uploadProgressMap);

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

  const { data, isLoading } = useQuery({
    queryFn: () => getMallByName(nameOfMall),
    queryKey: ["mall"],
  });

  // isError use garera route garyo ki update ma error aucha

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

  const {
    mutate: updateMall,
    isError: mallUpdateError,
    isPending: mallUpdating,
  } = useMutation({
    mutationFn: ({ mallData }: { mallData: FormData }) => {
      if (!data._id) {
        throw new Error("ID is required to update");
      }
      console.log("MallID:", data._id);
      return updateMallByName(data._id, mallData, handleUploadProgress);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mall"] });
      toast.success("Successfully Edited Mall", {
        position: "bottom-right",
      });
      router.push("/admin/dashboard");
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
    },
  });

  const { mutate: addShopMutate, isPending: shopAdding } = useMutation({
    mutationFn: ({ shopData, index }: { shopData: FormData; index: number }) =>
      addShop(shopData, (progressEvent) =>
        handleShopUploadProgress(index, progressEvent)
      ),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["shop"] });
      setshopId((prev) => [...prev, response.data.shopId]);
      console.log("ShopIDFromAdd:", response.data.shopId);
    },
  });

  // console.log("ShopIDs:", shopId);
  // console.log("FromEdit", ctxShopData);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      address: "",
      phone: "",
      level: "",
    },
  });
  const onsubmit = (data: z.infer<typeof formSchema>) => {
    // console.log("MallData is:", data);

    // console.log("ShopData is:", ctxShopData);

    ctxShopData.map((shopData, shopInx) => {
      const shopFormData = createShopFormData(shopData);
      if (shopData.id) {
        // console.log("uid Exists");
        updateShopData({
          id: shopData.id,
          shopData: shopFormData,
          index: shopInx,
        });
      } else {
        // console.log("UID doesn;t exits");
        addShopMutate({ shopData: shopFormData, index: shopInx });
      }
    });

    setMallData({
      ...data,
      level: parseInt(data.level, 10),
    });

    // console.log("shopData From Edit:", ctxShopData);

    if (ctxShopData.length === 0) {
      const formData = new FormData();
      formData.append("name", data?.name as string);
      formData.append("address", data?.address as string);
      formData.append("level", data?.level.toString());
      formData.append("phone", data?.phone as string);
      formData.append("openTime", openTime as string | Blob);
      formData.append("closeTime", closeTime as string | Blob);
      formData.append("image", mallImage as string | Blob);
      updateMall({ mallData: formData });
      setCtxShopData([]);
      if (!mallUpdateError) {
        redirect("/admin/dashboard");
      }
    }

    form.reset({
      name: "",
      address: "",
      phone: "",
      level: "",
      openTime: "",
      closeTime: "",
      image: undefined,
    });
  };

  // console.log("shopId From Edit:", shopId);

  useEffect(() => {
    if (
      shopId &&
      shopId.length === ctxShopData.length &&
      ctxShopData.length > 0
    ) {
      const formData = new FormData();
      formData.append("name", mallData?.name as string);
      formData.append("address", mallData?.address as string);
      formData.append("level", mallData?.level?.toString() || "0");
      formData.append("phone", mallData?.phone as string);
      formData.append("openTime", openTime as string | Blob);
      formData.append("closeTime", closeTime as string | Blob);
      formData.append("image", mallImage as string | Blob);

      shopId.forEach((id) => {
        formData.append("shopId", id as string);
      });

      updateMall({ mallData: formData });
      setshopId([]);
      setCtxShopData([]);
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
    ctxShopData,
    setCtxShopData,
    updateMall,
    mallUpdateError,
  ]);

  const handleMallImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let selectedFile;
    if (e.target.files) {
      selectedFile = e.target.files[0];
      setMallImage(selectedFile);
      form.setValue("image", selectedFile);
    }
  };

  useEffect(() => {
    if (data) {
      form.setValue("name", data.name);
      form.setValue("level", data.level);
      form.setValue("address", data.address);
      form.setValue("phone", data.phone);
      form.setValue("closeTime", data.closeTime);
      form.setValue("openTime", data.openTime);
      form.setValue("image", data.imageUrl);
      setMallImage(data.imageUrl);
      setOpenTime(data.openTime);
      setCloseTime(data.closeTime);
      setAddShopCounter(data.shops?.length);
      setUpdatedMall(data.name);
    }
  }, [data, form]);

  if (isLoading) {
    return <FormLoader />;
  }

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
              name="name"
              render={({ field }) => (
                <FormItem className="w-full mobile-md:w-[48%] desktop-md:w-[32%]">
                  <Input
                    {...field}
                    onChangeCapture={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setUpdatedMall(e.target.value)
                    }
                    className="shadow-none border-brand-text-secondary focus-visible:ring-0 focus-visible:outline-2 focus-visible:outline-brand-text-customBlue focus:border-none"
                    placeholder="Name of mall"
                  />
                  <FormControl />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem className="w-full mobile-md:w-[48%] desktop-md:w-[32%]">
                  <Input
                    {...field}
                    className="shadow-none border-brand-text-secondary focus-visible:ring-0 focus-visible:outline-2 focus-visible:outline-brand-text-customBlue focus:border-none"
                    placeholder="Address"
                  />
                  <FormControl />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="level"
              render={({ field }) => (
                <FormItem className="w-full mobile-md:w-[48%] desktop-md:w-[32%]">
                  <Input
                    {...field}
                    className="shadow-none border-brand-text-secondary focus-visible:ring-0 focus-visible:outline-2 focus-visible:outline-brand-text-customBlue focus:border-none"
                    placeholder="Level"
                  />
                  <FormControl />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="w-full mobile-md:w-[48%] desktop-md:w-[32%]">
                  <Input
                    {...field}
                    className="shadow-none border-brand-text-secondary focus-visible:ring-0 focus-visible:outline-2 focus-visible:outline-brand-text-customBlue focus:border-none"
                    placeholder="Phone Number"
                  />
                  <FormControl />
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
          {data?.shops && (
            <>
              {Array.from(Array(addShopCounter)).map((_, index) => {
                // Ensure that data.shops is defined and contains at least index + 1 elements
                // const shop =
                //   data?.shops &&
                //   Array.isArray(data.shops) &&
                //   data.shops.length > index
                //     ? data.shops[index]
                //     : null;

                return (
                  <EditAddShopForm
                    key={index}
                    addshopCounter={addShopCounter}
                    setAddShopCounter={setAddShopCounter}
                    index={index}
                    shop={data?.shops[index]}
                    mallName={updatedMall}
                    uploadProgressMap={uploadProgressMap.shops[index] || 0}
                  />
                );
              })}
            </>
          )}

          <EventButton
            content="Add Shop"
            type="button"
            icon={<CirclePlus />}
            className="hover:bg-brand-text-customBlue"
            onClick={() => setAddShopCounter(addShopCounter + 1)}
          />

          {uploadProgressMap.mall > 0 && (
            <div className="w-full">
              <p className="text-lg text-brand-text-tertiary">
                Progress: {uploadProgressMap.mall}%
              </p>
              <Progress
                value={uploadProgressMap.mall}
                max={100}
                className="w-full h-4"
                indicatorClassName="bg-green-500"
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

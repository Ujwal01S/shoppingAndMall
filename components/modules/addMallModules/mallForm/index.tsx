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
import { shopSchema } from "@/schemas/shopSchema";
import TimeRadio from "../../shared/radio";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosProgressEvent } from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

import { Progress } from "@/components/ui/progress";
import { mallSchema, phoneRegex } from "@/schemas/mallSchema";
import { createNewShopFormData } from "@/lib/createNewShopData";
import AddShopForm from "../addShop";

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

const formSchema = z.object({
  mall: mallSchema,
  shops: shopSchema,
});

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
  }>({
    mall: 0,
    shops: {},
  });
  const router = useRouter();

  const handleMallImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setMallImage(file);
      form.setValue("mall.image", file);
    }
  };
  type MallFormData = z.infer<typeof formSchema>;

  const form = useForm<MallFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mall: {},
      shops: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "shops",
  });

  const queryClient = useQueryClient();

  // query

  const { mutate: mutateMall, isPending: mallPending } = useMutation({
    mutationFn: (formData: FormData) =>
      postMallData(formData, handleUploadProgress),
    onSuccess: () => {
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
      postShopData(shopFormData, (progressEvent) =>
        handleShopUploadProgress(index, progressEvent)
      ),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["shop"] });
      setshopId((prev) => [...prev, response.data.shopId]);
    },
  });

  // progressBar

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

  // console.log({ mallImage });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log("Form Data:", data);
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
        { ...shop, video: shop.video ?? undefined },
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
      form.reset();
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

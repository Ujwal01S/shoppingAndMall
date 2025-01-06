"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CirclePlus, ImageUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChangeEvent, useContext, useEffect, useState } from "react";
import AddShopForm from "../addShop";
import TimeRadio from "../../shared/radio";
import EveryDayTimeComponent from "../../shared/time/everyDay";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createShopFormData } from "@/lib/createShopData";
import { ShopDataContext } from "@/store/editShopContext";

export const formSchema = z.object({
  name: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  address: z
    .string()
    .min(2, { message: "Address field must be atleast 2 characters" }),
  level: z.string().min(1, { message: "Level is required" }),
  phone: z
    .string()
    .min(10, { message: "phone number must be of 10 character" }),
});

const postMallData = async (MallFormData: FormData) => {
  const response = await axios.post("/api/mall", MallFormData);
  return response;
};

const postShopData = async (shopData: FormData) => {
  const response = await axios.post("/api/shop", shopData);
  return response;
};

const MallForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      address: "",
      phone: "",
      level: "",
    },
  });

  const { ctxShopData, setCtxShopData } = useContext(ShopDataContext);

  const queryClient = useQueryClient();

  const [radioValue, setRadioValue] = useState<string>("everyDay");

  // mallData state from useForm
  const [mallData, setMallData] = useState<{
    name: string;
    address: string;
    level: string;
    phone: string;
  }>();

  // clock state
  const [openTime, setOpenTime] = useState<string | null>("");
  const [closeTime, setCloseTime] = useState<string | null>("");

  const [mallImage, setMallImage] = useState<File | null>(null);
  const [shopId, setshopId] = useState<string[]>([]);
  const [mallName, setMallName] = useState<string>("");

  const handleOpenTime = (value: string | null) => {
    setOpenTime(value);
  };

  const handleCloseTime = (value: string | null) => {
    setCloseTime(value);
  };

  const { mutate: mutateMall } = useMutation({
    mutationFn: (MallFormData: FormData) => postMallData(MallFormData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mall"] });
    },
  });
  const { mutate: mutateShop } = useMutation({
    mutationFn: (shopFormData: FormData) => postShopData(shopFormData),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["shop"] });
      setshopId((prev) => [...prev, response.data.shopId]);
    },
  });

  const handleMallImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setMallImage(e.target.files[0]);
    }
  };

  const onsubmit = (data: z.infer<typeof formSchema>) => {
    ctxShopData.map((shop) => {
      const shopFormData = createShopFormData(shop);
      mutateShop(shopFormData);
    });

    setMallData(data);

    if (ctxShopData.length === 0) {
      const formData = new FormData();
      formData.append("name", data?.name as string);
      formData.append("address", data?.address as string);
      formData.append("level", data?.level as string);
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

  useEffect(() => {
    if (
      shopId &&
      shopId.length === ctxShopData.length &&
      ctxShopData.length > 0
    ) {
      const formData = new FormData();
      formData.append("name", mallData?.name as string);
      formData.append("address", mallData?.address as string);
      formData.append("level", mallData?.level as string);
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
                <FormItem className="w-[33%]">
                  <FormControl>
                    <Input
                      onChangeCapture={(e) =>
                        setMallName(e.currentTarget.value)
                      }
                      className="shadow-none border-brand-text-secondary focus-visible:ring-0 focus-visible:outline-2 focus-visible:outline-brand-text-customBlue
                                        focus:border-none"
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
                <FormItem className="w-[30%]">
                  <FormControl>
                    <Input
                      className="shadow-none border-brand-text-secondary focus-visible:ring-0 focus-visible:outline-2 focus-visible:outline-brand-text-customBlue
                                        focus:border-none"
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
                <FormItem className="w-1/3">
                  <FormControl>
                    <Input
                      className="shadow-none border-brand-text-secondary focus-visible:ring-0 focus-visible:outline-2 focus-visible:outline-brand-text-customBlue
                                        focus:border-none"
                      placeholder="Level"
                      {...field}
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
                <FormItem className="w-[33%]">
                  <FormControl>
                    <Input
                      className="shadow-none border-brand-text-secondary focus-visible:ring-0 focus-visible:outline-2 focus-visible:outline-brand-text-customBlue focus:border-none"
                      placeholder="Phone Number"
                      {...field}
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
              <input type="file" hidden onChange={handleMallImageChange} />
            </label>
            <p>{mallImage?.name.slice(0, 12)}</p>
          </div>

          <div>
            <p className="text-brand-text-secondary">
              Please note that the mall cannot open before 6am and should be
              closed before 11pm.
            </p>
          </div>

          <TimeRadio value={radioValue} setValue={setRadioValue} />

          <EveryDayTimeComponent
            closeTime={closeTime}
            handleCloseTime={handleCloseTime}
            handleOpenTime={handleOpenTime}
            openTime={openTime}
          />

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

          <div className="flex w-full justify-center mt-20">
            <Button
              type="submit"
              variant="signin"
              className="w-fit px-12 py-2 rounded-md font-semibold text-white bg-brand-text-footer hover:bg-brand-text-customBlue"
            >
              Save
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default MallForm;

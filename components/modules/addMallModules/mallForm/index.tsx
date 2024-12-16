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
import { useState } from "react";
import TimePicker from "react-time-picker";
import AddShopForm from "../addShop";

const formSchema = z.object({
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

const MallForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const [openTime, setOpenTime] = useState(new Date());

  const [shopData, setShopData] = useState<
    { shopName: string; level: string; phoneNumber: string }[]
  >([]);

  const onsubmit = (data: z.infer<typeof formSchema>) => {
    console.log(data);
    console.log("From Submit:", shopData);
  };

  const [counter, setCounter] = useState<number>(0);

  const handleShopDataChange = (
    index: number,
    newData: {
      shopName: string;
      level: string;
      phoneNumber: string;
      description: string;
      category: string;
      subCategory: string;
    }
  ) => {
    const updatedShopData = [...shopData];
    updatedShopData[index] = newData;
    setShopData(updatedShopData);
    // console.log("fromMainFrom", shopData);
  };

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
              <input type="file" hidden />
            </label>
          </div>

          <div>
            <p className="text-brand-text-secondary">
              Please note that the mall cannot open before 6am and should be
              closed before 11pm.
            </p>
          </div>

          <div className="flex gap-1 w-full">
            <div className="flex flex-col flex-nowrap w-full">
              <label>Open Time:</label>
              <TimePicker className="" value={openTime} />
            </div>

            <div className="flex flex-col flex-nowrap w-full">
              <label>Close Time:</label>
              <TimePicker className="" value={openTime} />
            </div>
          </div>

          <p className="font-semibold text-brand-text-secondary text-lg w-full border-b-2">
            Shop
          </p>

          {Array.from(Array(counter)).map((c, index) => {
            return (
              <AddShopForm
                key={index}
                index={index}
                onShopDataChange={handleShopDataChange}
                setCounter={setCounter}
                counter={counter}
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

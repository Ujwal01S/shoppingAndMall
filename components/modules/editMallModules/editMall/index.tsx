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
import { formSchema } from "../../addMallModules/mallForm";
import TimeRadio from "../../shared/radio";
import { useState } from "react";
import EveryDayTimeComponent from "../../shared/time/everyDay";
import { EventButton } from "../../shared/normalButton";
import EditAddShopForm from "../addShopFormEdit";

type EditMallFormType = {
  nameOfMall: string;
};

const EditMallForm = ({}: EditMallFormType) => {
  const [radioValue, setRadioValue] = useState<string>("everyDay");
  const [addShopCounter, setAddShopCounter] = useState<number>(0);

  const [openTime, setOpenTime] = useState<string | null>("");
  const [closeTime, setCloseTime] = useState<string | null>("");

  const handleOpenTime = (value: string | null) => {
    setOpenTime(value);
  };

  const handleCloseTime = (value: string | null) => {
    setCloseTime(value);
  };

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
    console.log(data);

    form.reset({
      name: "",
      address: "",
      phone: "",
      level: "",
    });
  };
  return (
    <div className="w-[60%] border-2 shadow-lg rounded-md px-4 py-6">
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
                <FormItem className="w-[32%]">
                  <Input
                    {...field}
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
                <FormItem className="w-[32%]">
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
                <FormItem className="w-[32%]">
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
                <FormItem className="w-[32%]">
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
              <input
                type="file"
                hidden
                //    onChange={handleMallImageChange}
              />
            </label>
            {/* <p>{mallImage?.name.slice(0, 12)}</p> */}
          </div>

          <p>
            Please note that the mall cannot open before 6 am and should be
            closed before 11pm
          </p>

          <TimeRadio value={radioValue} setValue={setRadioValue} />

          <EveryDayTimeComponent
            closeTime={closeTime}
            handleCloseTime={handleCloseTime}
            handleOpenTime={handleOpenTime}
            openTime={openTime}
          />

          {Array.from(Array(addShopCounter)).map((_, index) => {
            return (
              <EditAddShopForm
                key={index}
                addshopCounter={addShopCounter}
                setAddShopCounter={setAddShopCounter}
                index={index}
              />
            );
          })}

          <EventButton
            content="Add Shop"
            type="button"
            icon={<CirclePlus />}
            className="hover:bg-brand-text-customBlue"
            onClick={() => setAddShopCounter(addShopCounter + 1)}
          />

          <div className="mt-20 w-full flex justify-center">
            <EventButton
              content="Update"
              className="font-semibold px-10"
              type="submit"
            />
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EditMallForm;

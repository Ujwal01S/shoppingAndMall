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
import { CirclePlus, ImageUp, X } from "lucide-react";
import { formSchema } from "../../addMallModules/mallForm";
import TimeRadio from "../../shared/radio";
import { useContext, useEffect, useState } from "react";
import EveryDayTimeComponent from "../../shared/time/everyDay";
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
import { useRouter } from "next/navigation";

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
    level: string;
    phone: string;
  }>();

  const router = useRouter();
  const queryClient = useQueryClient();

  const handleOpenTime = (value: string | null) => {
    setOpenTime(value);
  };

  const handleCloseTime = (value: string | null) => {
    setCloseTime(value);
  };

  const [updatedMall, setUpdatedMall] = useState<string>("");

  const { data, isLoading } = useQuery({
    queryFn: () => getMallByName(nameOfMall),
    queryKey: ["mall"],
  });

  const { mutate: updateMall, isError } = useMutation({
    mutationFn: ({ mallData }: { mallData: FormData }) => {
      if (!data._id) {
        throw new Error("ID is required to update");
      }
      return updateMallByName(data._id, mallData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mall"] });
    },
  });

  const { mutate: updateShopData } = useMutation({
    mutationFn: ({ id, shopData }: { id: string; shopData: FormData }) => {
      if (!id) {
        throw new Error("ID is required for updating shop");
      }
      return updateShop(id, shopData);
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["shop"] });
      setshopId((prev) => [...prev, response.data.shopId]);
    },
  });

  const { mutate: addShopMutate } = useMutation({
    mutationFn: (shopData: FormData) => addShop(shopData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shop"] });
    },
  });

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
    console.log("MallData is:", data);

    console.log("ShopData is:", ctxShopData);

    ctxShopData.map((shopData) => {
      const shopFormData = createShopFormData(shopData);
      if (shopData.uid) {
        console.log("uid Exists");
        updateShopData({ id: shopData.uid, shopData: shopFormData });
      } else {
        console.log("UID doesn;t exits");
        addShopMutate(shopFormData);
      }
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
      updateMall({ mallData: formData });
      setCtxShopData([]);
    }

    form.reset({
      name: "",
      address: "",
      phone: "",
      level: "",
    });

    if (!isError) {
      router.push("/");
    }

    setAddShopCounter(0);
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

      updateMall({ mallData: formData });
      setshopId([]);
      setCtxShopData([]);
    }
  }, [shopId, mallData, closeTime, openTime, mallImage]);

  const handleMallImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let selectedFile;
    if (e.target.files) {
      selectedFile = e.target.files[0];
      setMallImage(selectedFile);
    }
  };

  useEffect(() => {
    if (data) {
      form.setValue("name", data.name);
      form.setValue("level", data.level);
      form.setValue("address", data.address);
      form.setValue("phone", data.phone);
      setMallImage(data.imageUrl);
      setOpenTime(data.openTime);
      setCloseTime(data.closeTime);
      setAddShopCounter(data.shops.length);
      setUpdatedMall(data.name);
    }
  }, [data, form]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <p className="text-green-500 text-lg">Data is loading..</p>
      </div>
    );
  }

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
              <input type="file" hidden onChange={handleMallImageChange} />
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
                shop={data.shops[index]}
                mallName={updatedMall}
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

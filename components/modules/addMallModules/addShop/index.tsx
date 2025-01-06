"use client";
import { X } from "lucide-react";
import { shops_categories as shopCategories } from "@/json_data/shops_category.json";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { useContext, useEffect, useState } from "react";
import EveryDayTimeComponent from "../../shared/time/everyDay";
import TimeRadio from "../../shared/radio";
import { Textarea } from "@/components/ui/textarea";
import { ShopDataContext } from "@/store/editShopContext";
import EditShopImageAndVideo from "../../editMallModules/editImageAndVideo";

type EditAddShopFormType = {
  setCounter: React.Dispatch<React.SetStateAction<number>>;
  counter: number;
  index: number;
  mallName: string;
};

const EditAddShopForm = ({
  setCounter,
  counter,
  index,
  mallName,
}: EditAddShopFormType) => {
  // console.log("FromSHopD:", shop.category);
  // console.log(shop);

  const [category, setCategory] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [level, setLevel] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [subCategory, setSubCategory] = useState<string>("");

  const { setCtxShopData } = useContext(ShopDataContext);

  // console.log("From EditMALL:", ctxShopData);

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    setCtxShopData((prev) => {
      const updatedData = [...prev];
      updatedData[index] = {
        ...updatedData[index],
        category: value,
      };
      return updatedData;
    });
  };

  useEffect(() => {
    if (mallName) {
      setCtxShopData((prev) => {
        const updatedData = [...prev];
        updatedData[index] = {
          ...updatedData[index],
          nameOfMall: mallName,
        };
        return updatedData;
      });
    }
  }, [mallName, index, setCtxShopData]);

  const handleSubCategoryChange = (value: string) => {
    setSubCategory(value);
    setCtxShopData((prev) => {
      const updatedData = [...prev];
      updatedData[index] = {
        ...updatedData[index],
        subCategory: value,
      };
      return updatedData;
    });
  };

  const [radioValue, setRadioValue] = useState<string>("everyDay");

  const [openTime, setOpenTime] = useState<string | null>("");
  const [closeTime, setCloseTime] = useState<string | null>("");

  const handleOpenTime = (value: string | null) => {
    setOpenTime(value);
    setCtxShopData((prev) => {
      const updatedData = [...prev];
      updatedData[index] = {
        ...updatedData[index],
        openTime: value,
      };
      return updatedData;
    });
  };

  const handleCloseTime = (value: string | null) => {
    setCloseTime(value);
    setCtxShopData((prev) => {
      const updatedData = [...prev];
      updatedData[index] = {
        ...updatedData[index],
        closeTime: value,
      };
      return updatedData;
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement> &
      React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    switch (id) {
      case "shopName":
        setName(value);
        break;
      case "level":
        setLevel(value);
        break;
      case "phoneNumber":
        setPhone(value);
        break;
      case "description":
        setDescription(value);
      default:
        break;
    }
    setCtxShopData((prev) => {
      const updatedData = [...prev]; //retain all previous value as it is
      updatedData[index] = {
        //get hold of data in the index
        ...updatedData[index], //have rest of object data in the index as it is
        [id]: value, //needed change in data add or append
      };
      return updatedData;
    });
  };

  return (
    <div className=" bg-[#F9F9F9] py-4 rounded flex flex-col gap-3 px-2">
      <div className="flex justify-end">
        <X
          className="hover:text-red-500"
          onClick={() => setCounter(counter - 1)}
        />
      </div>
      <div className="w-full flex gap-3 flex-wrap">
        <input
          id="shopName"
          value={name}
          className="shadow-none px-2 w-[30%] py-1.5 border-[1px] rounded border-brand-text-secondary focus-visible:ring-0 focus-visible:outline-2 focus-visible:outline-brand-text-customBlue focus:border-none"
          placeholder="Name of Shop"
          onChange={handleChange}
        />

        <input
          id="level"
          value={level}
          className="shadow-none px-2 w-1/3 py-1.5 border-[1px] rounded border-brand-text-secondary focus-visible:ring-0 focus-visible:outline-2 focus-visible:outline-brand-text-customBlue focus:border-none"
          placeholder="level"
          onChange={handleChange}
        />

        <input
          id="phoneNumber"
          value={phone}
          className="shadow-none px-2 w-[33%] py-1.5 border-[1px] rounded border-brand-text-secondary focus-visible:ring-0 focus-visible:outline-2 focus-visible:outline-brand-text-customBlue focus:border-none"
          placeholder="Phone Number"
          onChange={handleChange}
        />

        <Select value={category} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-[30%]">
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

        <Select value={subCategory} onValueChange={handleSubCategoryChange}>
          <SelectTrigger className="w-[30%]">
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
      </div>
      <div>
        <p className="text-brand-text-secondary">
          Please note that the shop timing has to be under the range of mall
          timings.
        </p>
      </div>

      <TimeRadio value={radioValue} setValue={setRadioValue} />

      <EveryDayTimeComponent
        closeTime={closeTime}
        handleCloseTime={handleCloseTime}
        handleOpenTime={handleOpenTime}
        openTime={openTime}
      />

      <Textarea
        id="description"
        placeholder="Description"
        value={description}
        onChange={handleChange}
      />

      <EditShopImageAndVideo index={index} />
    </div>
  );
};

export default EditAddShopForm;

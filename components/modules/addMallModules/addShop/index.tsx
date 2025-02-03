"use client";
import { X } from "lucide-react";
// import { shops_categories as shopCategories } from "@/json_data/shops_category.json";
import { shopCategories } from "@/json_data/shops_category.json";
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
import { Progress } from "@/components/ui/progress";

type EditAddShopFormType = {
  setCounter: React.Dispatch<React.SetStateAction<number>>;
  counter: number;
  index: number;
  mallName: string;
  uploadProgress: number;
};

const EditAddShopForm = ({
  setCounter,
  counter,
  index,
  mallName,
  uploadProgress,
}: EditAddShopFormType) => {
  // console.log("FromSHopD:", shop.category);
  // console.log(shop);

  const initialShopFormState = {
    description: "",
    level: "",
    phoneNumber: "",
    shopName: "",
    category: "",
    subCategory: "",
  };

  const [shopFormState, setShopFormState] = useState(initialShopFormState);

  const { setCtxShopData } = useContext(ShopDataContext);

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

  // console.log("Looking for category:", category);

  const filteredCategory = shopCategories.filter(
    (shopCateory) => shopCateory.text === shopFormState.category
  );

  // console.log("Filtering category", filteredCategory);

  const handleChange = (name: string, value: string) => {
    setShopFormState({
      ...shopFormState,
      [name]: value,
    });
    setCtxShopData((prev) => {
      const updatedData = [...prev]; //retain all previous value as it is
      updatedData[index] = {
        //get hold of data in the index
        ...updatedData[index], //have rest of object data in the index as it is
        [name]: value, //needed change in data add or append
      };
      return updatedData;
    });
  };

  return (
    <div className=" bg-[#F9F9F9] py-4 rounded flex flex-col gap-3">
      <div className="flex justify-end">
        <X
          className="hover:text-red-500"
          onClick={() => setCounter(counter - 1)}
        />
      </div>
      <div className="w-full flex gap-3 flex-wrap items-center">
        <input
          id="shopName"
          value={shopFormState.shopName}
          className="shadow-none px-2 w-full mobile-md:w-[48%] desktop-md:w-[32%] py-1.5 border-[1px] rounded border-brand-text-secondary focus-visible:ring-0 focus-visible:outline-2 focus-visible:outline-brand-text-customBlue focus:border-none"
          placeholder="Name of Shop"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleChange("shopName", e.target.value)
          }
        />

        <input
          id="level"
          value={shopFormState.level}
          className="shadow-none px-2 w-full mobile-md:w-[48%] desktop-md:w-[32%] py-1.5 border-[1px] rounded border-brand-text-secondary focus-visible:ring-0 focus-visible:outline-2 focus-visible:outline-brand-text-customBlue focus:border-none"
          placeholder="level"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleChange("level", e.target.value)
          }
        />

        <input
          id="phoneNumber"
          value={shopFormState.phoneNumber}
          className="shadow-none px-2 w-full mobile-md:w-[48%] desktop-md:w-[32%] py-1.5 border-[1px] rounded border-brand-text-secondary focus-visible:ring-0 focus-visible:outline-2 focus-visible:outline-brand-text-customBlue focus:border-none"
          placeholder="Phone Number"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleChange("phoneNumber", e.target.value)
          }
        />

        <Select
          value={shopFormState.category}
          onValueChange={(value: string) => handleChange("category", value)}
        >
          <SelectTrigger className="w-full mobile-md:w-[48%] desktop-md:w-[32%]">
            <SelectValue
              placeholder={
                shopFormState.category ? shopFormState.category : "categories"
              }
            />
          </SelectTrigger>
          <SelectContent>
            {shopCategories.map((category, index) => (
              <SelectItem key={index} value={category.text}>
                {category.text}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {filteredCategory[0]?.content.length > 0 ? (
          <Select
            value={shopFormState.subCategory}
            onValueChange={(value: string) =>
              handleChange("subCategory", value)
            }
          >
            <SelectTrigger className="w-full mobile-md:w-[48%] desktop-md:w-[32%]">
              <SelectValue
                placeholder={
                  shopFormState.subCategory
                    ? shopFormState.subCategory
                    : "SubCategories"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {shopCategories.map((subCategory) => (
                <React.Fragment key={subCategory.value}>
                  {shopFormState.category === subCategory.text && (
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
        ) : (
          <p className="border-2 px-2 py-2 rounded-md text-sm w-full mobile-md:w-[48%] desktop-md:w-[32%] text-brand-text-secondary">
            SubCategories
          </p>
        )}
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
        value={shopFormState.description}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
          handleChange("description", e.target.value)
        }
      />

      <EditShopImageAndVideo index={index} />

      {uploadProgress > 0 && (
        <div className="w-full">
          <p className="text-lg text-brand-text-tertiary">
            Progress: {uploadProgress}%
          </p>
          <Progress
            value={uploadProgress}
            max={100}
            className="w-full h-4"
            indicatorClassName="bg-brand-text-footer"
          />
        </div>
      )}
    </div>
  );
};

export default EditAddShopForm;

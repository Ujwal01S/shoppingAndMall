import React, { useEffect, useState } from "react";
import { shops_categories as shopCategories } from "@/json_data/shops_category.json";
import { Textarea } from "@/components/ui/textarea";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import TimeRadio from "../../shared/radio";
import EveryDayTimeComponent from "../../shared/time/everyDay";
import MediaUpload from "../../shared/mediaUpload";
interface ShopData {
  shopName: string;
  level: string;
  phoneNumber: string;
  description: string;
  category: string;
  subCategory: string;
  image: File[]; // image should be an array of File objects
  openTime: string | null;
  closeTime: string | null;
}
interface AdditionFormProps {
  index: number;
  onShopDataChange: (index: number, newData: ShopData) => void;
  setCounter: React.Dispatch<React.SetStateAction<number>>;
  counter: number;
  mallName?: string;
}

const AddShopForm = ({
  index,
  setCounter,
  onShopDataChange,
  counter,
}: AdditionFormProps) => {
  const [shopData, setShopData] = useState<ShopData>({
    shopName: "",
    level: "",
    phoneNumber: "",
    description: "",
    category: "",
    subCategory: "",
    image: [],
    openTime: "",
    closeTime: "",
  });

  const [category, setCategory] = useState<string>("");
  const [subCategory, setSubCategory] = useState<string>("");
  const [shopDescription, setDiscription] = useState<string>("");

  const [radioValue, setRadioValue] = useState<string>("everyDay");

  const [mallImage, setMallImage] = useState<File[]>([]);

  const [openTime, setOpenTime] = useState<string | null>("");

  const [closeTime, setCloseTime] = useState<string | null>("");

  const handleOpenTime = (value: string | null) => {
    setOpenTime(value);
  };

  useEffect(() => {
    setShopData((prev) => {
      const updatedData = {
        ...prev,
        openTime,
        closeTime,
      };
      return updatedData;
    });
  }, [openTime, closeTime]);

  const handleCloseTime = (value: string | null) => {
    setCloseTime(value);
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const newDescription = e.target.value;
    setDiscription(newDescription);

    setShopData((prevData) => {
      const updatedData = {
        ...prevData,
        description: shopDescription,
        category,
        subCategory,
      };
      onShopDataChange(index, updatedData);
      return updatedData;
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setShopData((prevData) => {
      const updatedData = {
        ...prevData,
        [id]: value,
        description: shopDescription,
        category,
        subCategory,
        image: mallImage,
      };
      onShopDataChange(index, updatedData);
      return updatedData;
    });
  };

  // Handle category change creates delay like when saving multiple from data by single state of object but when submitted updated value is taken
  const handleCategoryChange = (value: string) => {
    setCategory(value);
    setShopData((prevData) => {
      const updatedData = {
        ...prevData,
        category: value,
      };
      onShopDataChange(index, updatedData);
      return updatedData;
    });
  };

  const handleSubCategoryChange = (value: string) => {
    setSubCategory(value);
    setShopData((prevData) => {
      const updatedData = {
        ...prevData,
        subCategory: value,
      };
      onShopDataChange(index, updatedData);
      return updatedData;
    });
  };

  const handleAddImageChange = () => {
    setShopData((prevData) => {
      const updatedData = {
        ...prevData,
      };
      onShopDataChange(index, updatedData);
      return updatedData;
    });
  };

  useEffect(() => {
    setShopData((prevData) => {
      const updatedData = {
        ...prevData,
        image: mallImage,
      };
      onShopDataChange(index, updatedData);
      return updatedData;
    });
  }, [setShopData, mallImage]);

  // console.log(shopData);

  useEffect(() => {}, [index]);

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
          className="shadow-none px-2 w-[30%] py-1.5 border-[1px] rounded border-brand-text-secondary focus-visible:ring-0 focus-visible:outline-2 focus-visible:outline-brand-text-customBlue focus:border-none"
          placeholder="Name of Shop"
          onChange={handleChange}
        />

        <input
          id="level"
          className="shadow-none px-2 w-1/3 py-1.5 border-[1px] rounded border-brand-text-secondary focus-visible:ring-0 focus-visible:outline-2 focus-visible:outline-brand-text-customBlue focus:border-none"
          placeholder="level"
          onChange={handleChange}
        />

        <input
          id="phoneNumber"
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
        onChange={handleDescriptionChange}
      />

      <MediaUpload
        setMallImage={setMallImage}
        index={index}
        onAddImageChange={handleAddImageChange}
      />
    </div>
  );
};

export default AddShopForm;

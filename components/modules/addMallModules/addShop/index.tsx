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

interface AdditionFormProps {
  index: number;
  onShopDataChange: (
    index: number,
    newData: {
      shopName: string;
      level: string;
      phoneNumber: string;
      description: string;
      category: string;
      subCategory: string;
    }
  ) => void;
  setCounter: React.Dispatch<React.SetStateAction<number>>;
  counter: number;
}

const AddShopForm = ({
  index,
  setCounter,
  onShopDataChange,
  counter,
}: AdditionFormProps) => {
  const [shopData, setShopData] = useState({
    shopName: "",
    level: "",
    phoneNumber: "",
    description: "",
    category: "",
    subCategory: "",
  });

  const [category, setCategory] = useState<string>("");
  const [subCategory, setSubCategory] = useState<string>("");
  const [shopDescription, setDiscription] = useState<string>("");

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
      };
      onShopDataChange(index, updatedData);
      return updatedData;
    });
  };

  // Handle category change
  const handleCategoryChange = (value: string) => {
    setCategory(value);
    console.log("state taht delay update:", shopData);
    setShopData((prevData) => {
      const updatedData = {
        ...prevData,
        category: value,
      };
      onShopDataChange(index, updatedData);
      return updatedData;
    });
  };

  // Handle subCategory change
  const handleSubCategoryChange = (value: string) => {
    setShopData((prevData) => {
      const updatedData = {
        ...prevData,
        subCategory: value,
      };
      onShopDataChange(index, updatedData);
      return updatedData;
    });
  };

  //   console.log(shopData);

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

      <Textarea id="description" onChange={handleDescriptionChange} />
    </div>
  );
};

export default AddShopForm;

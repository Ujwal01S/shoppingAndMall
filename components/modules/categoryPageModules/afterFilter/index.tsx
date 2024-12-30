import { shops_categories as shopCategories } from "@/json_data/shops_category.json";
import { Grid2x2Plus } from "lucide-react";
import Link from "next/link";

type AfterFilterCategoryType = {
  name: string;
};

const AfterFilterCategory = ({ name }: AfterFilterCategoryType) => {
  const decodedName = decodeURIComponent(name);

  const filteredCategory = shopCategories.filter(
    (category) => category.text === decodedName
  );

  return (
    <div className="flex flex-col gap-3 w-[21%] mt-10">
      <p className="font-bold text-brand-text-primary text-xl">Shop Filters</p>
      <div className="flex gap-2">
        <Grid2x2Plus className="text-brand-text-customBlue" size={20} />
        <Link
          href="/"
          className=" font-medium text-brand-text-tertiary cursor-pointer hover:text-brand-text-customBlue"
        >
          All Categories
        </Link>
      </div>
      <p className="text-brand-text-tertiary cursor-pointer hover:text-brand-text-customBlue">
        {filteredCategory[0]?.text}
      </p>
      {filteredCategory[0]?.content.map((subCat, index) => (
        <Link
          href={`#`}
          key={index}
          className="hover:text-brand-text-customBlue pl-4 font-medium text-brand-text-tertiary"
        >
          {subCat.subContent}
        </Link>
      ))}
    </div>
  );
};

export default AfterFilterCategory;

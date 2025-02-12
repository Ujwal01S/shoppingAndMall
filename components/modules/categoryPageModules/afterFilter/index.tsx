"use client";
import { shopCategories } from "@/json_data/shops_category.json";
import { Grid2x2Plus } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";

type AfterFilterCategoryType = {
  name: string;
  sub?: string;
};

const AfterFilterCategory = ({ name, sub }: AfterFilterCategoryType) => {
  const { data: session } = useSession();
  const decodedName = decodeURIComponent(name);

  // console.log("FromFiler:", sub);

  const filteredCategory = shopCategories.filter(
    (category) => category.text === decodedName
  );

  return (
    <div className="hidden mobile-xl:flex flex-col gap-3 mr-2 w-[295px] mt-10">
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
      {filteredCategory[0]?.content.map((subCat) => (
        <Link
          href={`${
            session?.user.role === "admin"
              ? `/admin/home/category/${name}/${subCat.subContent}`
              : `/home/category/${name}/${subCat.subContent}`
          }`}
          key={subCat.value}
          className={`hover:text-brand-text-customBlue pl-4 ${
            subCat.subContent === sub
              ? "text-brand-text-customBlue"
              : "text-brand-text-tertiary"
          }`}
        >
          {subCat.subContent}
        </Link>
      ))}
    </div>
  );
};

export default AfterFilterCategory;

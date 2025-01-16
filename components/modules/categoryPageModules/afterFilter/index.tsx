import { auth } from "@/auth";
import { shopCategories } from "@/json_data/shops_category.json";
import { Grid2x2Plus } from "lucide-react";
import Link from "next/link";

type AfterFilterCategoryType = {
  name: string;
  sub?: string;
};

const AfterFilterCategory = async ({ name, sub }: AfterFilterCategoryType) => {
  const session = await auth();
  const decodedName = decodeURIComponent(name);

  // console.log("FromFiler:", sub);

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
          href={`${
            session?.user.role === "admin"
              ? `/admin/home/category/${name}/${subCat.subContent}`
              : `/home/category/${name}/${subCat.subContent}`
          }`}
          key={index}
          className={`hover:text-brand-text-customBlue pl-4 font-medium ${
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

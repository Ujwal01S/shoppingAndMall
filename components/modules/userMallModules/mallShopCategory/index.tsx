"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Grid2x2Plus, X } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

import { shops_categories as shopCategories } from "@/json_data/shops_category.json";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type ShopMallCategory = {
  title: "mall" | "shop" | "category";
  handleCategoryChange: (value: string) => void;
  setCategory: React.Dispatch<React.SetStateAction<string>>;
  category: string | undefined;
};

const ShopMallCategory = ({
  title,
  category,
  handleCategoryChange,
  setCategory,
}: ShopMallCategory) => {
  const { data: session } = useSession();
  const router = useRouter();

  const handleRemoveCategory = () => {
    setCategory("");
    router.back();
  };
  return (
    <div className="flex justify-between">
      <div className="flex flex-col gap-5">
        {category && (
          <div className="flex gap-3 items-center">
            <p className="text-brand-text-primary">{category}</p>
            <X
              size={20}
              className="text-red-600"
              onClick={handleRemoveCategory}
            />
          </div>
        )}
        <Select value={category} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-[280px] py-5 text-brand-text-customBlue">
            <div className="flex gap-3">
              <Grid2x2Plus size={20} />
              <p>Shop Categories</p>
            </div>
            {/* <SelectValue placeholder="" /> */}
          </SelectTrigger>
          <SelectContent>
            {shopCategories.map((category) => (
              <SelectItem key={category.value} value={category.text}>
                {category.content.length === 0 ? (
                  <>{category.text}</>
                ) : (
                  <>
                    <NavigationMenu orientation="vertical" className="">
                      <NavigationMenuList>
                        <NavigationMenuItem>
                          <NavigationMenuTrigger className="p-0">
                            {category.text}
                          </NavigationMenuTrigger>
                          <NavigationMenuContent className="flex flex-col min-w-[108px] gap-3">
                            {category.content.map((subCat) => (
                              <NavigationMenuLink key={subCat.value}>
                                {subCat.subContent}
                              </NavigationMenuLink>
                            ))}
                          </NavigationMenuContent>
                        </NavigationMenuItem>
                      </NavigationMenuList>
                    </NavigationMenu>
                  </>
                )}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {session?.user.role === "admin" && title === "mall" && (
        <Button
          variant="signin"
          className=" w-fit mt-2 rounded-none bg-brand-text-footer text-white py-5"
        >
          <Link href="/admin/newMall">Add New Mall</Link>
        </Button>
      )}
    </div>
  );
};

export default ShopMallCategory;

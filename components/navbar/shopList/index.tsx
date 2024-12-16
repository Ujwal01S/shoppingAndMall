import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

import { shops_categories as shopCategories } from "@/json_data/shops_category.json";
import Link from "next/link";
import React from "react";

const ShopList = () => {
  return (
    <NavigationMenu viewportClassName="left-[-2]">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-base font-bold">
            Shops
          </NavigationMenuTrigger>
          <NavigationMenuContent className="flex flex-col p-5 gap-4 min-w-fit font-normal">
            {shopCategories.map((category) => (
              <React.Fragment key={category.text}>
                {category.isNavContent === "false" ? (
                  <div
                    className="min-w-[250px] text-brand-text-primary hover:text-[#426CC0]"
                    key={category.text}
                  >
                    <Link className="relative" href={category.link}>
                      {category.text}
                    </Link>
                  </div>
                ) : (
                  <p>{}</p>
                )}
              </React.Fragment>
            ))}
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default ShopList;

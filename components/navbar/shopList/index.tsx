import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

import { shops_categories as shopCategories } from "@/json_data/shops_category.json";
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
                  <NavigationMenuLink
                    href={category.link}
                    className=" text-brand-text-primary min-w-[250px] hover:text-[#426CC0]"
                    key={category.text}
                  >
                    {category.text}
                  </NavigationMenuLink>
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



import { list_of_mall as listOfMall } from "@/json_data/list_of_mall.json";
import {list_of_shop as listOfShop} from "@/json_data/list_of_shop.json"


import CarouselCard from "@/components/carousel";
import Link from "next/link";

const MallsAndShops = () => {
  return (
    <div className="flex flex-col gap-6 w-full px-6">
      <div className="flex justify-between">
        <p className="font-bold text-brand-text-primary text-xl">Malls</p>
        <Link href="#" className="font-bold text-brand-text-customBlue text-lg">View all</Link>
      </div>

        <CarouselCard 
        content={listOfMall}
        />

      <div className="flex justify-between">
        <p className="font-bold text-brand-text-primary text-xl">Shops</p>
        <Link href="#" className="font-bold text-brand-text-customBlue text-lg">View all</Link>
      </div>

      <CarouselCard 
        content={listOfShop}
        />

    </div>
  );
};

export default MallsAndShops;

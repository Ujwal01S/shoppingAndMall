"use client";
import * as React from "react";
// import { list_of_mall as listOfMall } from "@/json_data/list_of_mall.json";

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import CarouselContentCard from "../modules/shared/carouselCard";

export interface ContentProps {
  _id: string;
  name: string;
  // location: string;
  imageUrl?: string;
  openTime: string;
  closeTime: string;
  address: string;
  shops?: never[];
  phone: string;
  image?: string[] | undefined;
  mallName?: string;
}

type CarouselCardProps = {
  content: ContentProps[];
  // role: string;
};

const CarouselCard = ({ content }: CarouselCardProps) => {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  // React.useEffect(() => {
  //   if (content) {
  //     setCount(content.length / 3 + 1);
  //   }
  // }, [content]);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <div className="">
      <Carousel
        opts={{ skipSnaps: false, slidesToScroll: 2, loop: false }}
        setApi={setApi}
      >
        <CarouselContent className="w-[350px]">
          {/* Error: The error TypeError: content.map is not a function occurs because content is not an array. To fix this, you need to ensure that content is always an array before calling the map function on it. */}
          {/*Answer: Array.isArray is being used to make sure that content is array need this because at begining it
          might be null or undefined because of api call */}
          {Array.isArray(content) &&
            content.map((mall) => (
              <CarouselItem key={mall._id} className="">
                {mall.imageUrl ? (
                  <CarouselContentCard
                    id={mall._id}
                    closeTime={mall.closeTime}
                    contact={mall.phone}
                    imageUrl={mall.imageUrl}
                    location={mall.address}
                    name={mall.name}
                    openTime={mall.openTime}
                    shops={mall.shops}
                    title="mall"
                    // role={role}
                  />
                ) : (
                  <CarouselContentCard
                    id={mall._id}
                    closeTime={mall.closeTime}
                    contact={mall.phone}
                    // the correct syntax for accessing data is . operation and optional chaining to make sure data exist before rendering
                    imageUrl={mall.image ? mall.image[0] : ""}
                    location={mall.mallName ? mall.mallName : ""}
                    name={mall.name}
                    openTime={mall.openTime}
                    title="shop"
                    // role={role}
                  />
                )}
              </CarouselItem>
            ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>

      <div className="py-2 text-center text-sm text-muted-foreground">
        {/* Slide {current} of {count} */}
        <div className="flex items-center gap-2 justify-center w-full">
          {Array.from({ length: count }, (_, index) => (
            <span
              key={index}
              className={`w-2 h-2 rounded-full ${
                index === current ? "bg-blue-600" : "bg-slate-400"
              }`}
            ></span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CarouselCard;

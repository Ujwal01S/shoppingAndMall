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
  const [carouselApi, setCarouselApi] = React.useState<CarouselApi | null>(
    null
  );
  const [currentIndex, setCurrentIndex] = React.useState(0);
  // const [count, setCount] = React.useState(0);
  const [totalItems, setTotalItems] = React.useState(0);

  React.useEffect(() => {
    if (!carouselApi) {
      return;
    }

    const updateCarouselState = () => {
      setCurrentIndex(carouselApi.selectedScrollSnap());
      setTotalItems(carouselApi.scrollSnapList().length);
    };

    updateCarouselState();

    carouselApi.on("select", updateCarouselState);

    return () => {
      carouselApi.off("select", updateCarouselState);
    };
  }, [carouselApi]);

  const scrollToIndex = (index: number) => {
    carouselApi?.scrollTo(index);
  };

  const scrollValue = window.screen.width < 814 ? 1 : 2;

  return (
    <div className="">
      <div className="relative">
        <Carousel
          opts={{ skipSnaps: false, slidesToScroll: scrollValue, loop: false }}
          setApi={setCarouselApi}
        >
          <CarouselContent className="w-[250px] tablet-sm:w-[300px]">
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
      </div>

      <div className="py-2 text-center text-sm text-muted-foreground">
        {/* Slide {current} of {count} */}
        <div className="flex items-center gap-3 justify-center w-full">
          {Array.from({ length: totalItems }, (_, index) => (
            <span
              key={index}
              onClick={() => scrollToIndex(index)}
              className={`w-1.5 h-1.5 rounded-full cursor-pointer hover:bg-black ${
                index === currentIndex
                  ? "bg-blue-600 hover:bg-blue-600"
                  : "bg-slate-400"
              }`}
            ></span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CarouselCard;

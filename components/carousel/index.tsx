"use client";

import * as React from "react";
import { list_of_mall as listOfMall } from "@/json_data/list_of_mall.json";

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import CarouselContentCard from "../modules/shared/carouselCard";

type CarouselCardProps = {
  content:typeof listOfMall
}


const CarouselCard = ({content}:CarouselCardProps) => {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);


  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <div className="">
      <Carousel opts={{ skipSnaps: false, slidesToScroll: 2, loop:false }} setApi={setApi}>
        <CarouselContent className="w-[350px]">
          {content.map((mall, index) => (
            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">

              <CarouselContentCard 
              closeTime={mall.closeTime}
              contact={mall.contact}
              imageUrl={mall.imageUrl}
              location={mall.location}
              name={mall.name}
              openTime={mall.openTime}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>

      <div className="py-2 text-center text-sm text-muted-foreground">
        Slide {current} of {count}
      </div>
    </div>
  );
};

export default CarouselCard;

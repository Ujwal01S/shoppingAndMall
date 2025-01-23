import { Button } from "@/components/ui/button";
import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const LoadingCarousel = () => {
  return (
    <div className="flex flex-col gap-4 w-full px-6 py-10 overflow-hidden">
      <Button
        variant="signin"
        className=" w-fit mt-2 rounded-none bg-brand-text-footer text-white py-5"
      >
        <p>Add New Mall</p>
      </Button>
      <div className="flex justify-between">
        <p className="font-bold text-brand-text-primary text-xl">Malls</p>
        <p className="font-bold text-brand-text-customBlue text-lg">View all</p>
      </div>
      <div className="flex gap-4">
        {Array.from({ length: 4 }, (_, index) => (
          <React.Fragment key={index}>
            <div>
              <Skeleton
                height={200}
                width={300}
                baseColor="#d3d3d3"
                // count={4}
              />
              <Skeleton baseColor="#d3d3d3" width={150} />
            </div>
          </React.Fragment>
        ))}
      </div>

      <div className="flex justify-between">
        <p className="font-bold text-brand-text-primary text-xl">Shops</p>
        <p className="font-bold text-brand-text-customBlue text-lg">View all</p>
      </div>

      <div className="flex gap-4">
        {Array.from({ length: 4 }, (_, index) => (
          <React.Fragment key={index}>
            <div>
              <Skeleton
                height={200}
                width={300}
                baseColor="#d3d3d3"
                // count={4}
              />
              <Skeleton baseColor="#d3d3d3" width={150} />
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default LoadingCarousel;

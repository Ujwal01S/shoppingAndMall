import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const FormLoader = () => {
  return (
    <div className="tablet-md:w-[60%] border-2 shadow-lg rounded-md px-4 py-6">
      <div className="flex flex-col justify-center gap-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div
            className="w-full mobile-md:w-[48%] desktop-md:w-[32%]"
            key={index}
          >
            <Skeleton baseColor="#d3d3d3" width={"100%"} />
          </div>
        ))}

        {Array.from({ length: 4 }, (_, index) => (
          <div
            className="w-full mobile-md:w-[48%] desktop-md:w-[32%]"
            key={index}
          >
            <Skeleton baseColor="#d3d3d3" width={"100%"} />
          </div>
        ))}

        {Array.from({ length: 4 }, (_, index) => (
          <div
            className="w-full mobile-md:w-[48%] desktop-md:w-[32%]"
            key={index}
          >
            <Skeleton baseColor="#d3d3d3" width={"100%"} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FormLoader;

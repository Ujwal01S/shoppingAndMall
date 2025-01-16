import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const CategoryLoader = () => {
  return (
    <div className="flex flex-col gap-6 w-full px-6 mt-10">
      <p className="font-bold text-brand-text-primary text-xl">Malls</p>

      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: 3 }, (_, index) => (
          <React.Fragment key={index}>
            <div>
              <Skeleton width={300} height={200} baseColor="#d3d3d3" />
              <Skeleton count={2} height={10} width={100} />
            </div>
          </React.Fragment>
        ))}
      </div>

      <p className="font-bold text-brand-text-primary text-xl">Shops</p>
      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: 3 }, (_, index) => (
          <React.Fragment key={index}>
            <div>
              <Skeleton width={300} height={200} baseColor="#d3d3d3" />
              <Skeleton count={2} height={10} width={100} />
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default CategoryLoader;

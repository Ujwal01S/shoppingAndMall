import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const DetailPageLoader = () => {
  return (
    <div className="flex flex-col w-full gap-5 items-center justify-center">
      <Skeleton width={10000} height={600} baseColor="#d3d3d3" />

      <div className="w-[70%] mt-10 border-b-2 border-b-black">
        <Skeleton height={10} width={400} count={3} />
      </div>

      <div className="w-[70%] flex flex-col gap-4 mt-4 mb-20">
        <p className="text-lg text-brand-text-primary font-bold">Shops</p>
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
    </div>
  );
};

export default DetailPageLoader;

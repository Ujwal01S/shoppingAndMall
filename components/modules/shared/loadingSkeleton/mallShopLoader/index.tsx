import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const MallShopLoader = () => {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-2xl font-bold text-brand-text-secondary">Malls</p>

      <div className="grid grid-cols-3 gap-5">
        {Array.from({ length: 12 }, (_, index) => (
          <React.Fragment key={index}>
            <div>
              <Skeleton
                height={300}
                width={400}
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

export default MallShopLoader;

import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const MallShopLoader = () => {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-2xl font-bold text-brand-text-secondary">Malls</p>

      <div className="grid tablet-sm:grid-cols-2 desktop-md:grid-cols-3 gap-6">
        {Array.from({ length: 12 }, (_, index) => (
          <React.Fragment key={index}>
            <div>
              <Skeleton
                height={250}
                width={300}
                baseColor="#d3d3d3"
                // count={4}
              />
              <Skeleton baseColor="#d3d3d3" count={2} width={150} />
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default MallShopLoader;

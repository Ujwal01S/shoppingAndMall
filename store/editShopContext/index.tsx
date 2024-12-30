"use client";
import { ShopDataProps } from "@/components/modules/addMallModules/addShop";
import React, { useState } from "react";

interface ShopDataContextProps {
  ctxShopData: ShopDataProps[];
  setCtxShopData: React.Dispatch<React.SetStateAction<ShopDataProps[]>>;
}

const ShopDataContext = React.createContext<ShopDataContextProps>({
  ctxShopData: [],
  setCtxShopData: () => {},
});

const ShopDataContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [ctxShopData, setCtxShopData] = useState<ShopDataProps[]>([]);
  return (
    <ShopDataContext.Provider value={{ ctxShopData, setCtxShopData }}>
      {children}
    </ShopDataContext.Provider>
  );
};

export { ShopDataContext, ShopDataContextProvider };

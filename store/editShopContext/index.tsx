"use client";
import React, { useState } from "react";

interface ShopDataProps {
  id?: string;
  category: string;
  closeTime: string | null;
  description: string;
  image: (string | File)[];
  level: string;
  nameOfMall: string;
  openTime: string | null;
  phoneNumber: string;
  shopName: string;
  subCategory: string;
  video?: string | File;
}
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

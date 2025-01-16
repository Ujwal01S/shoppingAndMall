import React, { useState } from "react";

export interface BreadCrumbContextProps {
  ctxBreadCrumbCategory: string[];
  setCtxBreadCrumbCategory: React.Dispatch<React.SetStateAction<string[]>>;
}

const BreadCrumbContext = React.createContext<BreadCrumbContextProps>({
  ctxBreadCrumbCategory: [],
  setCtxBreadCrumbCategory: () => {},
});

const BreadCrumbContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [ctxBreadCrumbCategory, setCtxBreadCrumbCategory] = useState<string[]>(
    []
  );
  return (
    <BreadCrumbContext.Provider
      value={{ ctxBreadCrumbCategory, setCtxBreadCrumbCategory }}
    >
      {children}
    </BreadCrumbContext.Provider>
  );
};

export { BreadCrumbContext, BreadCrumbContextProvider };

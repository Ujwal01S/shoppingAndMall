import React, { useState } from "react";

interface MediaContextType {
  ctxImage: File[][];
  setCtxImage: React.Dispatch<React.SetStateAction<File[][]>>;
}

const MediaContext = React.createContext<MediaContextType>({
  setCtxImage: () => {},
  ctxImage: [],
});

const MediaContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [ctxImage, setCtxImage] = useState<File[][]>([]);
  return (
    <MediaContext.Provider value={{ ctxImage, setCtxImage }}>
      {children}
    </MediaContext.Provider>
  );
};

export { MediaContextProvider, MediaContext };

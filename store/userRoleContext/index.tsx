import React, { useState } from "react";

type UserRoleContextType = {
  ctxUserRole: string;
  setCtxUserRole: React.Dispatch<React.SetStateAction<string>>;
};

const UserRoleContext = React.createContext<UserRoleContextType>({
  ctxUserRole: "",
  setCtxUserRole: () => {},
});

const UserRoleContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [ctxUserRole, setCtxUserRole] = useState<string>("");
  return (
    <UserRoleContext.Provider value={{ ctxUserRole, setCtxUserRole }}>
      {children}
    </UserRoleContext.Provider>
  );
};

export { UserRoleContext, UserRoleContextProvider };

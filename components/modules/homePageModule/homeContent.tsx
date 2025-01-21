"use client";

import { useContext, useEffect, useState } from "react";
import SearchBar from "./search";
import HomepageContent from "./homepageContent";
import { UserRoleContext } from "@/store/userRoleContext";

interface HomeContent {
  role: string;
}

const HomeContent = ({ role }: HomeContent) => {
  const [searchData, setSearchData] = useState<string>("");
  const { setCtxUserRole } = useContext(UserRoleContext);

  useEffect(() => {
    if (role) {
      setCtxUserRole(role);
    }
  }, [role, setCtxUserRole]);
  return (
    <div className="container mt-10">
      <SearchBar setSearch={setSearchData} />

      <HomepageContent searchData={searchData} />
    </div>
  );
};

export default HomeContent;

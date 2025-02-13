"use client";
// import { auth } from "@/auth";
import { navbarItemsListMap } from "@/components/utilityComponents/navbarTitles";
import { useSession } from "next-auth/react";
import Link from "next/link";
// import { useRouter } from "next/navigation";
import React from "react";

const ShopCategory = () => {
  // const router = useRouter();

  // const handleRoute = (link: string) => {
  //   router.push(`/admin/${link}`);
  // };

  const { data: session } = useSession();

  let route;
  if (session?.user.role === "admin") {
    route = "/admin";
  } else {
    route = "/";
  }

  return (
    <>
      {navbarItemsListMap.map((navItem, index) => (
        <React.Fragment key={index}>
          {navItem.navItemName === "Shop Category" ? (
            <Link
              className={`hover:text-brand-text-tertiary font-bold cursor-pointer ${
                session?.user.role === "admin" ? "" : "hidden"
              }`}
              href={`${route}/${navItem.link}`}
            >
              {navItem.navItemName}
            </Link>
          ) : (
            <Link
              className={`hover:text-brand-text-tertiary font-bold cursor-pointer`}
              href={`${navItem.link}`}
            >
              {navItem.navItemName}
            </Link>
          )}
        </React.Fragment>
      ))}
    </>
  );
};

export default ShopCategory;

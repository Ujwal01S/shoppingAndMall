
// Define the type for the navbar items
import { FC } from "react";

// Define the type for each navbar item
interface NavbarItem {
  navItemName: React.ReactNode;  // `navItemName` can be a string or a React component
  link: string;
}

// Typing the array of navbar items
const navbarItemsListMap: NavbarItem[] = [
  {
    navItemName: "Malls",
    link: "#",
  },
  {
    navItemName: <ShopList />, // React component
    link: "#",
  },
  {
    navItemName: "About Us",
    link: "#",
  },
  {
    navItemName: "Contact Us",
    link: "#",
  },
];

export { navbarItemsListMap };

import Link from "next/link";
import ShopList from "@/components/navbar/shopList";

const NavbarLinkContentForDemo: FC = () => {
  return (
    <>
      {navbarItemsListMap.map((navItem, index) => (
        <Link href={navItem.link} key={index}>
          {navItem.navItemName}
        </Link>
      ))}
    </>
  );
};

export default NavbarLinkContentForDemo;

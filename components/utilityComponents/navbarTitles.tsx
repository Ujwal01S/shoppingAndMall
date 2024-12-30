import ShopList from "../navbar/shopList";

interface NavbarItem {
  navItemName: React.ReactNode; // `navItemName` can be a string or a React component
  link: string;
  // adminLink: string;
}

const navbarItemsListMap: NavbarItem[] = [
  {
    navItemName: "Malls",
    link: "/malls",
  },
  {
    link: "/admin/shops",
    navItemName: <ShopList />,
  },
  {
    navItemName: "About Us",
    link: "/about-us",
  },
  {
    navItemName: "Contact Us",
    link: "/contact-us",
  },
];

export { navbarItemsListMap };

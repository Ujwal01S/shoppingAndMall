import ShopList from "../navbar/shopList";

interface NavbarItem {
  navItemName: React.ReactNode; // `navItemName` can be a string or a React component
  link: string;
  adminLink: string;
}

const navbarItemsListMap: NavbarItem[] = [
  {
    navItemName: "Malls",
    link: "/malls",
    adminLink: "/admin/malls",
  },
  {
    link: "/shops",
    navItemName: <ShopList />,
    adminLink: "/admin/shops",
  },
  {
    link: "#",
    navItemName: "Shop Category",
    adminLink: "/admin/addshopcategories",
  },
  {
    navItemName: "About Us",
    link: "/about-us",
    adminLink: "/about-us",
  },
  {
    navItemName: "Contact Us",
    link: "/contact-us",
    adminLink: "/contact-us",
  },
];

export { navbarItemsListMap };

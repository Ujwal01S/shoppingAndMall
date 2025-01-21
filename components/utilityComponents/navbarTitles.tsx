interface NavbarItem {
  navItemName: React.ReactNode; // `navItemName` can be a string or a React component
  link: string;
}

const navbarItemsListMap: NavbarItem[] = [
  {
    link: "/addshopcategories",
    navItemName: "Shop Category",
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

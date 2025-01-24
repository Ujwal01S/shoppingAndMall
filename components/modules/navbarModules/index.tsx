// import { navbarItemsListMap } from "@/components/utilityComponents/navbarTitles";
import Link from "next/link";
import UserActivityLog from "./userLog";
import { Button } from "@/components/ui/button";
import React from "react";
import ShopList from "@/components/navbar/shopList";
import ShopCategory from "./shopCategory";
import { UserRole } from "@/types/next-auth";
import MobileShopList from "@/components/navbar/mobileShopList";

// when using useSession here u logout but signIn is only shown after refreshing when loginIn too only after refresh userActivity is shown

type UserProps = {
  id: string;
  role: UserRole;
  name: string;
  email: string;
  isAdmin?: boolean;
  image?: string;
};
export interface NavbarLinkContentProps {
  session: { user: UserProps } | null;
}

const NavbarLinkContent = ({ session }: NavbarLinkContentProps) => {
  // const session = await auth();
  // const { data: session, status } = useSession();

  // if (status === "loading") {
  //   return (
  //     <div className="flex flex-col tablet-md:flex-row tablet-md:justify-between gap-6 tablet-md:items-center text-brand-text-primary">
  //       {/* Optionally, you can display a loading spinner or some placeholder UI */}
  //       Loading...
  //     </div>
  //   );
  // }

  return (
    <div className="flex flex-col tablet-md:flex-row tablet-md:justify-between gap-6 tablet-md:items-center text-brand-text-primary">
      <Link
        className={`hover:text-brand-text-tertiary font-bold 
        }`}
        href={session?.user.role === "admin" ? "/admin/malls" : "/malls"}
      >
        Malls
      </Link>
      <div className="hidden tablet-md:flex">
        <ShopList />
      </div>

      <div className="tablet-md:hidden">
        <MobileShopList />
      </div>

      <ShopCategory />
      {/* <ThemeSwitch /> */}

      {session && session.user ? (
        <UserActivityLog
          isAdmin={session.user.isAdmin}
          role={session.user.role}
          image={session.user.image}
          id={session.user.id}
          session={session}
        />
      ) : (
        <Button
          variant="signin"
          className="border-blue-600 text-brand-text-footer hover:text-brand-text-customBlue hover:border-blue-400"
        >
          <Link href="/login"> Sign In </Link>
        </Button>
      )}
    </div>
  );
};

export default NavbarLinkContent;

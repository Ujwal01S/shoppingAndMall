"use client";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { CircleUser, LogOut, UserPlus } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { signOut } from "next-auth/react";

import { updateRole } from "@/actions/update";
import { NavbarLinkContentProps } from "..";
import { Button } from "@/components/ui/button";
// import { useRouter } from "next/navigation";

type UserActivityLogProps = {
  isAdmin: boolean | undefined;
  role: string | undefined;
  image: string | undefined;
  id: string | undefined;
} & NavbarLinkContentProps;

// role change only happened after adding session strategy to jwt in auth.ts

const UserActivityLog = ({
  isAdmin,
  role,
  image,
  id,
  session,
}: UserActivityLogProps) => {
  // const { data: session, update } = useSession();
  // const router = useRouter();

  const onClick = () => {
    signOut();
  };

  // console.log({ isAdmin, role, image, id });

  const handleSwitch = async () => {
    try {
      const newRole = role === "admin" ? "user" : "admin";
      await updateRole(newRole, id as string);

      // Force session refresh

      window.location.reload();
    } catch (error) {
      console.error("Role switch failed:", error);
    }
  };

  return (
    <>
      <NavigationMenu className="font-medium hidden tablet-md:flex" dir="rtl">
        <NavigationMenuList>
          <NavigationMenuItem className="relative">
            <NavigationMenuTrigger className="relative">
              <Avatar>
                <AvatarImage src={image} />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </NavigationMenuTrigger>
            <NavigationMenuContent className="min-w-full flex flex-col text-brand-text-primary pt-4">
              {/* <div className="text-base flex flex-col gap-4"> */}
              {isAdmin && (
                <>
                  <Link
                    href="#"
                    className="gap-2 hover:text-brand-text-tertiary py-4 px-3"
                  >
                    <div
                      className="px-2 flex gap-2 w-full justify-end"
                      onClick={handleSwitch}
                    >
                      Switch to {role === "admin" ? "user" : "admin"}
                      <CircleUser />
                    </div>
                  </Link>
                  {role === "admin" && (
                    <Link
                      href="/admin/createuser"
                      className="gap-2 hover:text-brand-text-tertiary py-4 px-3"
                    >
                      <div className="px-2 w-full flex gap-2 justify-end">
                        Manage User
                        <UserPlus />
                      </div>
                    </Link>
                  )}
                </>
              )}
              <div
                className="px-5 flex justify-end gap-2 hover:text-red-500 bg-[#E8E8E8] py-4 cursor-pointer w-full"
                onClick={onClick}
              >
                Logout <LogOut />
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <div className="tablet-md:hidden bg-[#F9F9F9]">
        {session && session.user ? (
          <>
            {isAdmin && (
              <>
                <Link
                  href="#"
                  className="gap-2 hover:text-brand-text-tertiary px-3"
                >
                  <div className="px-2 flex gap-2" onClick={handleSwitch}>
                    <CircleUser />
                    Switch to {role === "admin" ? "user" : "admin"}
                  </div>
                </Link>
                {role === "admin" && (
                  <Link href="/admin/createuser" className="gap-2 py-4 px-3">
                    <div className="px-2 w-full flex gap-2 ">
                      <UserPlus />
                      Manage User
                    </div>
                  </Link>
                )}
              </>
            )}
            <div
              className="px-2 flex gap-2 pb-3 cursor-pointer w-full"
              onClick={onClick}
            >
              <LogOut />
              Logout
            </div>
          </>
        ) : (
          <>
            <Button
              variant="signin"
              className="border-blue-600 text-brand-text-footer hover:text-brand-text-customBlue hover:border-blue-400"
            >
              <Link href="/login"> Sign In </Link>
            </Button>
          </>
        )}
      </div>
    </>
  );
};

export default UserActivityLog;

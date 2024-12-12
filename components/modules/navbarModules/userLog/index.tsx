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
import { logOut } from "@/actions/logOut";
import { useSession } from "next-auth/react";

type UserActivityLogProps = {
  isAdmin: boolean | undefined;
  role: string | undefined;
};

// role change only happened after adding session strategy to jwt in auth.ts

const UserActivityLog = ({ isAdmin }: UserActivityLogProps) => {
  const { data: session, update } = useSession();

  const onClick = () => {
    logOut();
  };

  const handleSwitch = async () => {
    let newRole;
    if (session?.user.role === "admin") {
      newRole = "user";
    } else {
      newRole = "admin";
    }

    // below code only update session in client side once page is refreshed the updated user no longer remains same but goes back to what was there in database

    await update({
      ...session,
      user: {
        ...session?.user,
        role: newRole,
      },
    });
    await fetch("/api/auth/session");
  };

  return (
    <NavigationMenu
      orientation="vertical"
      viewportClassName="right-0"
      className="font-medium"
    >
      <NavigationMenuList>
        <NavigationMenuItem className="relative">
          <NavigationMenuTrigger className="relative">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </NavigationMenuTrigger>
          <NavigationMenuContent className="min-w-80 flex flex-col text-brand-text-primary pt-4">
            {/* <div className="text-base flex flex-col gap-4"> */}
            {isAdmin && (
              <>
                <Link
                  href="#"
                  className="flex gap-2 hover:text-brand-text-tertiary py-4 px-3"
                >
                  <div
                    className="px-2 flex gap-2 w-full"
                    onClick={handleSwitch}
                  >
                    <CircleUser /> Switch to{" "}
                    {session?.user.role === "admin" ? "user" : "admin"}
                  </div>
                </Link>
                {session?.user.role === "admin" && (
                  <Link
                    href="/admin/createuser"
                    className="flex gap-2 hover:text-brand-text-tertiary py-4 px-3"
                  >
                    <div className="px-2 flex gap-2 ">
                      <UserPlus /> Manage User
                    </div>
                  </Link>
                )}
              </>
            )}
            {/* <Link href="#" className=" hover:text-red-500 bg-[#E8E8E8] py-4"> */}
            <div
              className="px-5 flex gap-2 hover:text-red-500 bg-[#E8E8E8] py-4 cursor-pointer"
              onClick={onClick}
            >
              <LogOut /> Logout
            </div>
            {/* </Link> */}
            {/* </div> */}
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default UserActivityLog;

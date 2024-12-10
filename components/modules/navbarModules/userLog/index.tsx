"use client";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { CircleUser, LogOut } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { logOut } from "@/actions/logOut";

type UserActivityLogProps = {
  isAdmin:boolean | undefined
  role:string | undefined
}

const UserActivityLog = ({isAdmin}:UserActivityLogProps) => {

  const onClick = () => {
    logOut();
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
          <NavigationMenuContent className="min-w-80 flex flex-col  text-brand-text-primary pt-4">
            {/* <div className="text-base flex flex-col gap-4"> */}
            {isAdmin && 
            <Link
              href="#"
              className="flex gap-2 hover:text-brand-text-tertiary py-4"
            >
              <div className="px-2 flex gap-2">
                <CircleUser /> Switch to 
              </div>
            </Link>
              }
            <Link href="#">Link</Link>
            {/* <Link href="#" className=" hover:text-red-500 bg-[#E8E8E8] py-4"> */}
            <div
              className="px-2 flex gap-2 hover:text-red-500 bg-[#E8E8E8] py-4 cursor-pointer"
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

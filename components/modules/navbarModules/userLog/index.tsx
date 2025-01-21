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
// import { useRouter } from "next/navigation";

type UserActivityLogProps = {
  isAdmin: boolean | undefined;
  role: string | undefined;
  image: string | undefined;
  id: string | undefined;
};

// role change only happened after adding session strategy to jwt in auth.ts

const UserActivityLog = ({
  isAdmin,
  role,
  image,
  id,
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
    <NavigationMenu className="font-medium" dir="rtl">
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
  );
};

export default UserActivityLog;

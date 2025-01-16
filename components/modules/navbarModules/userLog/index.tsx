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
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type UserActivityLogProps = {
  isAdmin: boolean | undefined;
  role: string | undefined;
};

// role change only happened after adding session strategy to jwt in auth.ts

const UserActivityLog = ({ isAdmin }: UserActivityLogProps) => {
  const { data: session, update } = useSession();
  const router = useRouter();

  const onClick = () => {
    signOut();
  };

  const handleSwitch = async () => {
    try {
      const newRole = session?.user.role === "admin" ? "user" : "admin";

      await update({
        ...session,
        user: {
          ...session?.user,
          role: newRole,
        },
      });

      await fetch("/api/auth/session");

      router.refresh();
    } catch (error) {
      console.error("Role switch failed:", error);
      throw new Error("Failed to switch role. Please try again.");
    }
  };

  return (
    <NavigationMenu className="font-medium" dir="rtl">
      <NavigationMenuList>
        <NavigationMenuItem className="relative">
          <NavigationMenuTrigger className="relative">
            <Avatar>
              <AvatarImage src={session?.user.image} />
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
                    Switch to{" "}
                    {session?.user.role === "admin" ? "user" : "admin"}
                    <CircleUser />
                  </div>
                </Link>
                {session?.user.role === "admin" && (
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

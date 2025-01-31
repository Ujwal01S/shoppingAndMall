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
import { getSession, signOut, useSession } from "next-auth/react";

import { NavbarLinkContentProps } from "..";
import { Button } from "@/components/ui/button";

import { useEffect } from "react";
import { redirect } from "next/navigation";

type UserActivityLogProps = {
  isAdmin: boolean | undefined;
  role: string | undefined;
  image: string | undefined;
  id: string | undefined;
} & NavbarLinkContentProps;

export const handler = async () => {
  const session = await getSession({ broadcast: true });

  return session;
};

const UserActivityLog = ({
  isAdmin,
  //role,
  image,
}: // id,
// session,
UserActivityLogProps) => {
  const { data: session, update } = useSession();
  //const router = useRouter();
  // console.log("UserActivityLosssg", session);

  const onClick = () => {
    signOut();
  };

  useEffect(() => {
    handler();
  }, []);

  const handleSwitch = async () => {
    try {
      // console.log("🔄 Switching role... Current:", session?.user?.role);

      const newRole = session?.user?.role === "admin" ? "user" : "admin";

      // Force refresh with updated data
      await update({
        ...session,
        user: {
          ...session?.user,
          role: newRole, // Replace with actual new role
        },
      }); // Ensure role update triggers session update

      // console.log("✅ Role Updated. Refreshing session...");
    } catch (error) {
      console.error("⚠️ Role switch failed:", error);
    }

    redirect("/");
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
                      Switch to{" "}
                      {session?.user?.role === "admin" ? "user" : "admin"}
                      <CircleUser />
                    </div>
                  </Link>
                  {session?.user?.role === "admin" && (
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
                    Switch to{" "}
                    {session?.user?.role === "admin" ? "user" : "admin"}
                  </div>
                </Link>
                {session?.user?.role === "admin" && (
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

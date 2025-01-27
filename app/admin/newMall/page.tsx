"use client";
import MallForm from "@/components/modules/addMallModules/mallForm";
import { ShopDataContextProvider } from "@/store/editShopContext";
import { MediaContextProvider } from "@/store/mediaUploadContext";
// import { useSession } from "next-auth/react";
// import { redirect } from "next/navigation";
// import { useEffect } from "react";

const NewMallPage = () => {
  // const { data: session } = useSession();

  // useEffect(() => {
  //   if (!session) {
  //     redirect("/");
  //   }
  //   if (!session?.user.isAdmin) {
  //     redirect("/");
  //   }
  //   if (session.user.role === "user") {
  //     redirect("/");
  //   }
  // }, [session]);
  return (
    <ShopDataContextProvider>
      <MediaContextProvider>
        <div className="w-full mt-24 flex justify-center">
          <div className="flex flex-col items-center tablet-md:w-[60%]">
            <p className="text-4xl text-brand-text-secondary font-bold m-4">
              Mall Form
            </p>

            <div className=" border-2 shadow-lg rounded-md px-4 py-6">
              <MallForm />
            </div>
          </div>
        </div>
      </MediaContextProvider>
    </ShopDataContextProvider>
  );
};

export default NewMallPage;

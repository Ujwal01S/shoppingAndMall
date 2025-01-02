"use client";

import CategoryTable from "@/components/modules/addCategoryModules/categoryTable/intex";
import EditOrAddCategoryPopup from "@/components/modules/addCategoryModules/editCategory";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { getAllCategory } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

const AddCategoryPage = () => {
  const { data: session } = useSession();
  const [open, setOpen] = useState<boolean>(false);
  useEffect(() => {
    if (!session) {
      redirect("/");
    }
    if (!session?.user.isAdmin) {
      redirect("/");
    }
    if (session.user.role === "user") {
      redirect("/");
    }
  }, [session, session?.user]);

  const { data, isLoading } = useQuery({
    queryFn: () => getAllCategory(),
    queryKey: ["category"],
  });

  if (isLoading) {
    return (
      <div className="flex items-start justify-center">
        <p className="text-2xl text-green-500">Category is loading...</p>
      </div>
    );
  }

  console.log(data);

  return (
    <div className="flex mt-20 items-center justify-center w-full">
      <div className=" flex flex-col w-[68%] mt-10 gap-4 mb-10">
        <p className="text-4xl font-bold text-brand-text-primary">
          Shop Catgegories
        </p>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger className="w-fit bg-brand-text-footer text-white px-4 py-2">
            Add New Category
          </DialogTrigger>

          <EditOrAddCategoryPopup setOpen={setOpen} operationType="add" />
        </Dialog>

        <CategoryTable content={data?.categories} />
      </div>
    </div>
  );
};

export default AddCategoryPage;

"use client";

import CategoryTable from "@/components/modules/addCategoryModules/categoryTable/intex";
import EditOrAddCategoryPopup from "@/components/modules/addCategoryModules/editCategory";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { getAllCategory } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export interface Category {
  _id: string;
  category: string;
  subCategory: string[];
}

const AddCategoryPage = () => {
  const [open, setOpen] = useState<boolean>(false);

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

  return (
    <div className="flex mt-20 items-center justify-center w-full">
      <div className=" flex flex-col overflow-x-auto tablet-sm:w-[68%] mt-10 gap-4 mb-10">
        <p className="text-4xl font-bold text-brand-text-primary">
          Shop Categories
        </p>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger className="w-fit bg-brand-text-footer text-white px-4 py-2">
            Add New Category
          </DialogTrigger>
          <EditOrAddCategoryPopup operationType="add" setOpen={setOpen} />
        </Dialog>

        <CategoryTable content={data?.categories} />
      </div>
    </div>
  );
};

export default AddCategoryPage;

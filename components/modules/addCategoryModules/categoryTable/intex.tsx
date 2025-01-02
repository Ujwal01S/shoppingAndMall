"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { shopTableHeader } from "@/json_data/shopCategory";
import { ChevronRight, Delete, FilePenLine, Trash2 } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import EditCategoryPopup from "../editCategory";
import { useState } from "react";
import Modal from "../../shared/modal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCategory } from "@/lib/api";

interface CategoryProps {
  category: string;
  subCategory?: string[];
  _id: string;
}

export type CategoryTableType = {
  content: CategoryProps[];
};

const CategoryTable = ({ content }: CategoryTableType) => {
  const [open, setOpen] = useState<boolean>(false);
  const [id, setId] = useState<string>("");
  const [modelOpen, setModelOpen] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryProps | null>(null);

  const [accordian, setAccordian] = useState<boolean>(false);

  const queryClient = useQueryClient();

  const handleEditClick = (category: CategoryProps) => {
    setSelectedCategory(category);
    setOpen(true);
  };

  const { mutate: deleteMutate, isError: deleteError } = useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["category"] });
    },
  });

  const handleDelete = (id: string) => {
    deleteMutate(id);
    setId("");
    if (!deleteError) {
      setModelOpen(false);
    }
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="sr-only w-[10px]">Expand</TableHead>
            {shopTableHeader.map((header) => (
              <TableHead
                className=""
                style={{ width: header.width }}
                key={header.title}
              >
                {header.title}
              </TableHead>
            ))}
            <TableHead className="sr-only w-[10px]">Edit & Delete</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {content.map((category, index) => (
            <TableRow key={category._id}>
              <TableCell className="w-[10px]">
                {category.subCategory && category.subCategory?.length > 0 && (
                  <ChevronRight
                    onClick={() => setAccordian(!accordian)}
                    className={`${accordian && "rotate-90"}`}
                  />
                )}
              </TableCell>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{category.category}</TableCell>
              <TableCell className="">
                <div className="flex gap-2  text-brand-text-customBlue cursor-pointer">
                  <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger
                      className="w-fit flex gap-1 hover:text-black"
                      onClick={() => handleEditClick(category)}
                    >
                      <FilePenLine size={18} /> Edit
                    </DialogTrigger>

                    {/* For Edit user we directly send data from map(data) but this time when edit is clicked every data in table only recieved final data values so when clicked stored category in state and send value from state */}

                    <EditCategoryPopup
                      key={index}
                      category={selectedCategory?.category}
                      subCategory={selectedCategory?.subCategory}
                      _id={selectedCategory?._id}
                      setOpen={setOpen}
                      operationType="update"
                    />
                  </Dialog>
                  <span
                    className="flex gap-1 hover:text-black"
                    onClick={() => {
                      setModelOpen(true);
                      setId(category._id);
                    }}
                  >
                    <Trash2 size={18} /> Delete
                  </span>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Modal onClose={() => setModelOpen(false)} open={modelOpen}>
        <div className="text-center">
          <Delete size={60} className="mx-auto text-red-500" />
          <div className="mx-auto my-4 w-52">
            <h3 className="text-lg font-black text-gray-800">Confirm Delete</h3>
            <p className="text-sm text-gray-500">
              Are you sure you want to Delete?
            </p>
          </div>

          <div className="flex gap-7 w-full items-center px-56 justify-between">
            <button
              onClick={() => handleDelete(id)}
              className=" bg-red-600 px-8 rounded-md py-1 font-semibold text-white shadow-md hover:shadow-blue-400/40 hover:bg-red-700"
            >
              <p>Delete</p>
            </button>

            <button
              onClick={() => setModelOpen(false)}
              className="bg-slate-600 text-white px-6 py-1 rounded-md ml-14 shadow-md hover:shadow-slate-400 hover:bg-slate-700"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default CategoryTable;

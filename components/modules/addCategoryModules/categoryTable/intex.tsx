"use client";
import React, { useState } from "react";
import { useTable, Column } from "react-table";
import { ChevronRight, Delete, FilePenLine, Trash2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCategory } from "@/lib/api";
import Modal from "../../shared/modal";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import EditOrAddCategoryPopup from "../editCategory";

interface Category {
  _id: string;
  category: string;
  subCategory: string[];
}

interface CategoryTableProps {
  content: Category[];
}

const CategoryTable: React.FC<CategoryTableProps> = ({
  content: data,
  // onEditClick,
}) => {
  const [clickedCategory, setClickedCategory] = useState<string | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [id, setId] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );

  const handleClick = (categoryId: string) => {
    setClickedCategory((prev) => (prev === categoryId ? null : categoryId));
  };

  const handleEditClick = (category: Category) => {
    setSelectedCategory(category);
    // setOpen(true);
  };

  const queryClient = useQueryClient();

  const { mutate: deleteCategoryFunction, isError } = useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["category"] });
    },
  });

  const handleDeleteClick = (catId: string) => {
    // console.log(catId);
    deleteCategoryFunction(catId);

    if (!isError) {
      setOpen(false);
    }
  };

  const columns: Column<Category>[] = React.useMemo(
    () => [
      {
        Header: "",
        accessor: "_id",
        Cell: ({ row }: { row: { original: Category } }) => (
          <div className="">
            {row.original.subCategory.length > 0 && (
              <ChevronRight
                onClick={() => handleClick(row.original._id)}
                className={`${
                  row.original._id === clickedCategory ? "rotate-90" : ""
                } cursor-pointer`}
              />
            )}
          </div>
        ),
        style: { width: "50px" },
      },
      {
        Header: "Category",
        accessor: "category",
        Cell: ({ row }: { row: { original: Category } }) => (
          <div className="flex items-center space-x-2">
            {/* {row.original.subCategory.length > 0 && (
              <ChevronRight
                onClick={() => handleClick(row.original._id)}
                className={`${
                  row.original._id === clickedCategory ? "rotate-90" : ""
                } cursor-pointer`}
              />
            )} */}
            <span>{row.original.category}</span>
          </div>
        ),
      },
      {
        Header: "Edit",
        Cell: ({ row }: { row: { original: Category } }) => (
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger
              className="text-brand-text-customBlue cursor-pointer hover:text-black flex gap-2"
              onClick={() => handleEditClick(row.original)}
            >
              <FilePenLine size={18} />
              Edit
            </DialogTrigger>

            <EditOrAddCategoryPopup
              setOpen={setOpenDialog}
              operationType="update"
              category={selectedCategory?.category}
              subCategory={selectedCategory?.subCategory}
              _id={selectedCategory?._id}
            />
          </Dialog>
        ),
      },
      {
        Header: "Delete",
        Cell: ({ row }: { row: { original: Category } }) => (
          <button
            onClick={() => {
              setId(row.original._id);
              setOpen(true);
            }}
            className="text-brand-text-customBlue cursor-pointer hover:text-black flex gap-2"
          >
            <Trash2 size={18} />
            Delete
          </button>
        ),
      },
    ],
    [clickedCategory, openDialog, selectedCategory]
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data,
    });

  return (
    <>
      <table
        {...getTableProps()}
        className="min-w-full divide-y divide-gray-200"
      >
        <thead className="bg-gray-50">
          {headerGroups.map((headerGroup, index) => (
            <tr {...headerGroup.getHeaderGroupProps()} key={index}>
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps()}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  key={column.id}
                >
                  {column.render("Header")}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody
          {...getTableBodyProps()}
          className="bg-white divide-y divide-gray-200"
        >
          {rows.map((row) => {
            prepareRow(row);
            const category = row.original;
            return (
              <React.Fragment key={category._id}>
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => (
                    <td
                      {...cell.getCellProps()}
                      style={cell.column.style}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                      key={cell.column.id}
                    >
                      {cell.render("Cell")}
                    </td>
                  ))}
                </tr>
                {/* Render subcategory table only if this row is clicked */}
                {category.subCategory?.length > 0 &&
                  clickedCategory === category._id && (
                    <tr>
                      <td colSpan={4} className="p-0">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                SN
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Subcategory
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {category.subCategory.map((sub, index) => (
                              <tr key={index}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {index + 1}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {sub}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
      <Modal onClose={() => setOpen(false)} open={open}>
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
              onClick={() => handleDeleteClick(id)}
              className=" bg-red-600 px-8 rounded-md py-1 font-semibold text-white shadow-md hover:shadow-blue-400/40 hover:bg-red-700"
            >
              <p>Delete</p>
            </button>

            <button
              onClick={() => setOpen(false)}
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

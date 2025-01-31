"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { table_headers as tableHeaders } from "@/json_data/table_header";
import { Delete, DeleteIcon, FilePenLine, Trash2, X } from "lucide-react";
import { useState } from "react";
import Modal from "../../shared/modal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import EditUser from "../editUser";
import Image from "next/image";
import { BASE_API_URL } from "@/lib/constant";

type TTextAlign =
  | "start"
  | "end"
  | "left"
  | "right"
  | "center"
  | "justify"
  | "match-parent";

export interface UserProps {
  name: string;
  password: string;
  role: string;
  _id: string;
  imageUrl: string;
  email: string;
  isAdmin?: boolean;
}

interface TableComponentProps {
  users: UserProps[];
}

export const deleteUserApi = async (id: string) => {
  const response = await axios.delete(`${BASE_API_URL}/api/user/${id}`);
  return response;
};

const TableComponent = ({ users }: TableComponentProps) => {
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);

  const [id, setId] = useState<string>("");

  const { mutate, error } = useMutation({
    mutationFn: (id: string) => deleteUserApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  const handleDelete = (id: string) => {
    mutate(id);
    if (!error) {
      setOpen(false);
    }
  };

  return (
    <>
      <Table key="table">
        <TableHeader>
          <TableRow className="bg-[#F9FAFB] hover:bg-[#F9FAFB]">
            {tableHeaders.map((header) => (
              <TableHead
                key={header.title}
                className={``}
                style={{
                  width: header.width,
                  textAlign: header.text as TTextAlign,
                }}
              >
                {header.title}
              </TableHead>
            ))}
            <TableHead>
              <span className="sr-only">Logo</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody key="body">
          {users?.map((user, index) => (
            <TableRow key={user._id}>
              <TableCell className="text-left">{index + 1}</TableCell>
              <TableCell className="text-left">
                <Image
                  alt="logo"
                  src={user.imageUrl}
                  className="rounded-full text-nowrap"
                  width={36}
                  height={36}
                />
              </TableCell>
              <TableCell className="text-left">{user.name}</TableCell>
              <TableCell className="text-center">*******</TableCell>
              <TableCell className="text-left">{user.role}</TableCell>
              <TableCell>
                <div className="flex gap-2  text-brand-text-customBlue cursor-pointer">
                  <Dialog>
                    <DialogTrigger
                      className="w-fit flex gap-1 hover:text-black"
                      onClick={() => setId(user._id)}
                    >
                      <FilePenLine size={18} /> Edit
                    </DialogTrigger>
                    <EditUser
                      _id={user._id}
                      email={user.email}
                      imageUrl={user.imageUrl}
                      name={user.name}
                      password={user.password}
                      role={user.role}
                    />
                  </Dialog>

                  {!user?.isAdmin && (
                    <span
                      className="flex gap-1 hover:text-black"
                      onClick={() => {
                        setOpen(true);
                        setId(user._id);
                      }}
                    >
                      <Trash2 size={18} /> Delete
                    </span>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Modal onClose={() => setOpen(false)} open={open}>
        <div className="text-center">
          <Delete size={60} className="mx-auto text-red-500" />
          <div className="mx-auto my-4 ">
            <h3 className="text-lg font-black text-gray-800">Confirm Delete</h3>
            <p className="text-sm text-gray-500">
              Are you sure you want to Delete?
            </p>
          </div>

          <div className="flex tablet-lg:gap-7 w-full items-center tablet-lg:mx-auto px-4 tablet-lg:justify-between">
            <button
              onClick={() => handleDelete(id)}
              className=" bg-red-600 px-4 mobile-xl:px-6 rounded-md py-1 font-semibold text-white shadow-md hover:shadow-blue-400/40 hover:bg-red-700"
            >
              <p className="hidden mobile-xl:flex">Delete</p>
              <DeleteIcon size={20} className="mobile-xl:hidden" />
            </button>

            <button
              onClick={() => setOpen(false)}
              className="bg-slate-600 text-white px-4 mobile-xl:px-6 py-1 rounded-md ml-14 shadow-md hover:shadow-slate-400 hover:bg-slate-700"
            >
              <p className="hidden mobile-xl:flex">Cancel</p>
              <X size={20} className="mobile-xl:hidden" />
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default TableComponent;

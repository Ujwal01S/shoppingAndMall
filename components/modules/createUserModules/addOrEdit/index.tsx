"use client";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ChangeEvent, FormEvent, useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import axios from "axios";
import { Plus } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface UserOperationProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  // setUsers: React.Dispatch<
  //   React.SetStateAction<
  //     {
  //       name: string;
  //       password: string;
  //       role: string;
  //       id: string;
  //       imageUrl: string;
  //     }[]
  //   >
  // >;
}

export const postUserData = async (formData: FormData) => {
  try {
    const response = await axios.post("/api/user", formData);
    if (!response) {
      console.log("Failed to post data");
    }
  } catch (error) {
    console.log(error);
  }
};

const UserOperation = ({ setOpen }: UserOperationProps) => {
  const [image, setImage] = useState<File | null>(null);
  const [userFormData, setUserFormData] = useState<{
    name: string;
    password: string;
    email: string;
  }>({ name: "", password: "", email: "" });
  const [role, setRole] = useState<string>("");

  const queryClient = useQueryClient();

  const { mutate, isError } = useMutation({
    mutationFn: (formData: FormData) => postUserData(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUserFormData({ ...userFormData, [e.target.id]: e.target.value });
  };

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImage(e.target.files[0]);
    }
  };

  const onSubmitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("image", image as string | Blob);
    formData.append("name", userFormData.name as string);
    formData.append("password", userFormData.password as string);
    formData.append("email", userFormData.email as string);
    formData.append("role", role as string);

    mutate(formData);

    if (!isError) setOpen(false);
  };
  return (
    <DialogContent className="justify-start min-w-[40%]">
      <DialogHeader>
        <DialogTitle>Add New User</DialogTitle>
      </DialogHeader>

      <form
        onSubmit={onSubmitHandler}
        className="mx-auto py-10 flex min-w-[200%] flex-col gap-4"
      >
        <input
          id="name"
          onChange={handleChange}
          placeholder="User Name"
          className="text-base
           text-brand-text-tertiary rounded border-[1px] py-2 focus:border-brand-text-customBlue focus:ring-0  focus:outline-none"
        />
        <input
          id="email"
          onChange={handleChange}
          placeholder="Email"
          className="text-base
           text-brand-text-tertiary rounded border-[1px] py-2 focus:border-brand-text-customBlue focus:ring-0  focus:outline-none"
        />
        <input
          id="password"
          placeholder="********"
          onChange={handleChange}
          className="text-base text-brand-text-tertiary rounded border-[1px] py-2 focus:border-brand-text-customBlue focus:ring-0  focus:outline-none"
        />
        <Select value={role} onValueChange={setRole}>
          <SelectTrigger className="h-10 shadow-none">
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="user">User</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
        <label>
          <span className="flex gap-2 text-brand-text-customBlue hover:text-brand-text-footer">
            <p className="text-nowrap">Add Image</p>
            <Plus />
          </span>
          <input type="file" onChange={onChangeHandler} hidden />
        </label>
        {image && (
          <div className="flex bg-slate-400 w-fit rounded-full items-center gap-2 px-2">
            <p
              className="text-xs hover:bg-brand-text-customBlue w-4"
              onClick={() => setImage(null)}
            >
              X
            </p>
            <p className="">{image.name.slice(0, 10)}</p>
          </div>
        )}
        <button
          className="bg-brand-text-footer w-fit hover:bg-brand-text-customBlue px-6 py-2 rounded text-white"
          type="submit"
        >
          Add
        </button>
      </form>
    </DialogContent>
  );
};

export default UserOperation;

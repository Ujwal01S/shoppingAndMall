"use client"
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { UserProps } from "../table";


export const updateUser = async (id: string, formData: FormData) => {
    const response = await axios.put(`/api/user/${id}`, formData
        /*{
       headers: {
           'Content-Type': 'multipart/form-data', // Optional, axios usually sets this automatically when using FormData
       }, 
   } */

    );
    return response;
}

const EditUser = ({ _id, imageUrl, name, role, email }: UserProps) => {

    console.log("FromSingle", name);

    const queryClient = useQueryClient();

    const { mutate } = useMutation({
        mutationFn: async (formData: FormData) => await axios.put(`/api/user/${_id}`, formData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["user"] })
        }
    });

    const [image, setImage] = useState<File | null>(null);
    const [newImageUrl, setImageUrl] = useState<string>("");
    const [userFormData, setUserFormData] = useState<{
        name: string;
        password: string;
        email: string;
    }>({ name: "", password: "", email: "" });
    const [userRole, setRole] = useState<string>("");


    useEffect(() => {

        // Wrap in async function and log the result

        // const user = await getSingleUser(id);
        setUserFormData({
            name: name,
            password: "",
            email: email
        })
        setRole(role);
        console.log("imageUrl:", imageUrl);
        setImageUrl(imageUrl);


    }, [])


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserFormData({ ...userFormData, [e.target.id]: e.target.value });
    };

    const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setImage(e.target.files[0]);
        }
    };

    // below code is for updating without reactQuery

    // const updateData = async (id: string) => {
    //     const formData = new FormData();
    //     formData.append("name", userFormData.name);
    //     formData.append("password", userFormData.password);
    //     formData.append("email", userFormData.email);
    //     formData.append("role", role);
    //     if (imageUrl) {
    //         formData.append("image", imageUrl)
    //     } else {
    //         formData.append("image", image as string | Blob);
    //     }

    //     const response = await axios.put(`/api/user/${id}`, formData
    //         /*{
    //        headers: {
    //            'Content-Type': 'multipart/form-data', // Optional, axios usually sets this automatically when using FormData
    //        }, 
    //    } */

    //     );
    //     return response;
    // }

    const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", userFormData.name);
        formData.append("password", userFormData.password);
        formData.append("email", userFormData.email);
        formData.append("role", role);
        if (newImageUrl) {
            formData.append("image", imageUrl)
        } else {
            formData.append("image", image as string | Blob);
        }

        mutate(formData);
    };

    return (
        <DialogContent className="justify-start min-w-[40%]">
            <DialogHeader>
                <DialogTitle>Edit User</DialogTitle>
            </DialogHeader>

            <form
                onSubmit={onSubmitHandler}
                className="mx-auto py-10 flex min-w-[200%] flex-col gap-4"
            >
                <input
                    id="name"
                    value={userFormData.name}
                    onChange={handleChange}
                    placeholder="User Name"
                    className="text-base
           text-brand-text-tertiary rounded border-[1px] py-2 focus:border-brand-text-customBlue focus:ring-0  focus:outline-none"
                />
                <input
                    id="email"
                    onChange={handleChange}
                    placeholder="Email"
                    value={userFormData.email}
                    className="text-base
           text-brand-text-tertiary rounded border-[1px] py-2 focus:border-brand-text-customBlue focus:ring-0  focus:outline-none"
                />
                <input
                    id="password"
                    placeholder="********"
                    onChange={handleChange}
                    value={userFormData.password}
                    className="text-base text-brand-text-tertiary rounded border-[1px] py-2 focus:border-brand-text-customBlue focus:ring-0  focus:outline-none"
                />
                <Select value={userRole} onValueChange={setRole}>
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
                {image ? (
                    <div className="flex bg-slate-400 w-fit rounded-full items-center gap-2 px-2">
                        <p
                            className="text-xs hover:bg-brand-text-customBlue w-4"
                            onClick={() => setImage(null)}
                        >
                            X
                        </p>
                        <p className="">{image.name.slice(0, 10)}</p>
                    </div>
                ) : (
                    <div className="flex bg-slate-400 w-fit rounded-full items-center gap-2 px-2">
                        <p
                            className={`text-xs hover:bg-brand-text-customBlue w-4 ${newImageUrl ? 'visible' : "hidden"}`}
                            onClick={() => setImageUrl("")}
                        >
                            X
                        </p>
                        <p className="">{newImageUrl.slice(0, 10)}</p>
                    </div>
                )
                }
                <button
                    className="bg-brand-text-footer w-fit hover:bg-brand-text-customBlue px-6 py-2 rounded text-white"
                    type="submit"
                >
                    Update
                </button>
            </form>
        </DialogContent>
    );
}

export default EditUser;
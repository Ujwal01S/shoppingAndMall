import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";

type EditUserProps = {
    id: string
}

// export const getSingleUser = async (id: string) => {
//     console.log("From getUser", id)
//     const response = await axios.get(`/api/user/${id}`);
//     return response
// }

const EditUser = ({ id }: EditUserProps) => {

    // const queryClient = useQueryClient();

    // const { data: userInfo } = useQuery({
    //     queryFn: async () => await getSingleUser(id),
    //     queryKey: ["user"],
    // });

    const [image, setImage] = useState<File | null>(null);
    const [userFormData, setUserFormData] = useState<{
        name: string;
        password: string;
        email: string;
    }>({ name: "", password: "", email: "" });
    const [role, setRole] = useState<string>("");


    useEffect(() => {
        const getSingleUser = async (id: string) => {
            try {
                const { data } = await axios.get(`/api/user/${id}`);
                return data.user;
            } catch (error) {
                console.error("Error fetching user:", error);
            }
        }

        // Wrap in async function and log the result
        const fetchUser = async () => {
            const user = await getSingleUser(id);
            setUserFormData({
                name: user.name,
                password: "",
                email: user.email
            })
            setRole(user.role);
            // setImage(user.imageUrl);
        }

        fetchUser();
    }, [id])


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserFormData({ ...userFormData, [e.target.id]: e.target.value });
    };

    const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setImage(e.target.files[0]);
        }
    };

    const updateData = async (id: string) => {
        const formData = new FormData();
        // formData.append("image", image as string | Blob);
        formData.append("name", userFormData.name);
        formData.append("password", userFormData.password);
        formData.append("email", userFormData.email);
        formData.append("role", role);

        // Do not manually set Content-Type; let FormData handle it
        const response = await axios.put(`/api/user/${id}`, formData, /*{
            headers: {
                'Content-Type': 'multipart/form-data', // Optional, axios usually sets this automatically when using FormData
            }, 
        } */);
        return response;
    }
    const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();


        await updateData(id);
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
                    Update
                </button>
            </form>
        </DialogContent>
    );
}

export default EditUser;
import TableComponent from "./table";
import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import UserOperation from "./addOrEdit";
import { useState } from "react";
import axios from "axios";

const CreateUserContent = () => {
  const [open, setOpen] = useState(false);

  // const [users, setUsers] = useState<
  //   {
  //     name: string;
  //     password: string;
  //     role: string;
  //     _id: string;
  //     imageUrl: string;
  //   }[]
  // >([]);

  const fetchAllUsers = async () => {
    try {
      const {
        data: { users },
      } = await axios.get("/api/user");
      // setUsers(users);

      return users;
    } catch (error) {
      console.log(error);
    }
  };

  const { data, isLoading, isError } = useQuery({
    queryFn: async () => await fetchAllUsers(),
    queryKey: ["user"],
  });

  // useEffect(() => {
  //   if (data) {
  //     setUsers(data)
  //   }
  // }, [data])

  // Return early with loading/error state if necessary
  if (isLoading) {
    return <div>Loading users...</div>;
  }

  if (isError) {
    return <div>Error loading users.</div>;
  }



  return (
    <div className="w-full flex items-center justify-center">
      <div className="my-8 flex flex-col gap-4 w-[60%]">
        <p className="text-3xl text-brand-text-secondary font-bold">Users</p>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger className="w-fit">
            <div className=" w-fit mt-2 rounded-none bg-brand-text-footer text-white p-2">
              <p>Add New User</p>
            </div>
          </DialogTrigger>

          <UserOperation setOpen={setOpen} />
        </Dialog>
        <TableComponent users={data} />
      </div>
    </div>
  );
};

export default CreateUserContent;

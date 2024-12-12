import TableComponent from "./table";

import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import UserOperation from "./addOrEdit";
import { useEffect, useState } from "react";
import axios from "axios";

const CreateUserContent = () => {
  const [open, setOpen] = useState(false);

  const [images, setImages] = useState<
    {
      imageUrl: string;
      publicId: string;
      _id: string;
    }[]
  >([]);

  const fetchImages = async () => {
    try {
      const {
        data: { images },
      } = await axios.get("/api/image-upload");
      setImages(images);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  console.log(images);

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
        <TableComponent />
      </div>
    </div>
  );
};

export default CreateUserContent;

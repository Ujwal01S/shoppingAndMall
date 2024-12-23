import { SearchIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const MallSearch = () => {
  return (
    <Popover>
      <PopoverTrigger className="w-full bg-[#efefef] px-60 py-6 flex gap-2 items-center mt-16">
        <SearchIcon />
        <input
          placeholder="Search Malls..."
          className="focus:outline-none bg-[#efefef]"
        />
      </PopoverTrigger>

      <PopoverContent className="w-screen pl-44 text-brand-text-secondary">
        <div className="w-[40%] flex justify-between items-center">
          <p className="font-bold">Quick Links</p>

          <div className="flex flex-col">
            <p>New Mall</p>
            <p>City Center</p>
          </div>

          <div className="flex flex-col">
            <p>Blue Bird Mall</p>
            <p>Civil Mall</p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default MallSearch;

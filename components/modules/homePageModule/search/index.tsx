import { Card } from "@/components/ui/card";
import { Search } from "lucide-react";

interface SearchBarProps {
  setSearch?: React.Dispatch<React.SetStateAction<string | null>>;
}

const SearchBar = ({ setSearch }: SearchBarProps) => {
  return (
    <div className="w-full absolute top-[360px] flex justify-center">
      <Card className="min-w-[50%] p-4 flex gap-3 text-brand-text-primary focus:shadow-lg">
        <Search />
        {setSearch && (
          <input
            className="w-full focus:outline-none"
            placeholder="Search mall..."
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearch(e.target.value)
            }
          />
        )}
      </Card>
    </div>
  );
};

export default SearchBar;

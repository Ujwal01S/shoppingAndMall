import { Card } from "@/components/ui/card";
import { Search } from "lucide-react";


const SearchBar = () => {
    return ( 
        <div className="w-full absolute top-[360px] flex justify-center">
        <Card className="min-w-[50%] p-4 flex gap-3 text-brand-text-primary">
            <Search />
          <input className="w-full focus:outline-none" placeholder="Search mall..."/>
        </Card>
      </div>

     );
}
 
export default SearchBar;
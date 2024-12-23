import MallCard from "../../shared/mallCard";
import { list_of_mall as listOfMall } from "@/json_data/list_of_mall.json";

const MallsComponent = () => {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-2xl font-bold text-brand-text-secondary">Malls</p>

      <div className="grid grid-cols-3 gap-6">
        {listOfMall.map((mall) => (
          <MallCard content={mall} key={mall.name} />
        ))}
      </div>
    </div>
  );
};

export default MallsComponent;

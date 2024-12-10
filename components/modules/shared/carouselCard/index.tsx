import { list_of_mall as listOfMall } from "@/json_data/list_of_mall.json";
import { Separator } from "@/components/ui/separator";

type CarouselContentCardProps = {
    name: string;
    location: string;
    imageUrl: string;
    openTime: string;
    closeTime: string;
    contact: string;
};

const CarouselContentCard = ({ closeTime,contact,imageUrl,location,name,openTime}: CarouselContentCardProps) => {
    return (
    <div className="p-2" key={name}>
      <div className="rounded-md shadow-md flex flex-col">
        <img src={`${imageUrl}`} className="h-[200px] rounded-md" />
        <div className="flex gap-1 px-2 font-semibold text-brand-text-footer w-full overflow-hidden">
          <p className="text-nowrap">{name}</p>
          <Separator
            orientation="vertical"
            className="w-2 "
          />
          <p className="text-nowrap">{location}</p>
        </div>
        <div className="flex text-brand-text-footer px-2">
          <p>
            {openTime}-{closeTime}, +999-{contact}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CarouselContentCard;

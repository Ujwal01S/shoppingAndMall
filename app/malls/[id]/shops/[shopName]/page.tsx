import ShopDetailComponent from "@/components/modules/shopPageModules";
import axios from "axios";

export const getSingleShop = async (name: string) => {
  const { data } = await axios.get(`/api/shop/${name}`);
  return data;
};

type PropsType = {
  params: Promise<{ shopName: string }>;
};

const ShopPage = async ({ params }: PropsType) => {
  const { shopName } = await params;

  console.log(shopName);
  return (
    <div className="flex items-center justify-center">
      <ShopDetailComponent name={shopName} />
    </div>
  );
};

export default ShopPage;

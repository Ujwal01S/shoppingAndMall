import ShopContent from "@/components/modules/shopModules";
import MallSearch from "@/components/modules/userMallModules/mallSearch";
import ShopMallCategory from "@/components/modules/userMallModules/mallShopCategory";

const ShopPage = () => {
  return (
    <div className="w-full flex flex-col items-center gap-14 mb-8">
      <MallSearch />
      <div className="w-[70%] flex flex-col gap-3">
        <ShopMallCategory title="shop" />
        <ShopContent />
      </div>
    </div>
  );
};

export default ShopPage;

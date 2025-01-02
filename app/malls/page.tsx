import MallsComponent from "@/components/modules/userMallModules/mall";
import MallSearch from "@/components/modules/userMallModules/mallSearch";
import ShopMallCategory from "@/components/modules/userMallModules/mallShopCategory";

const MallPage = () => {
  return (
    <div className="w-full flex flex-col items-center gap-14 mb-8">
      <MallSearch />
      <div className="w-[70%] flex flex-col gap-3">
        <ShopMallCategory title="mall" />

        {/* mall component below */}

        <MallsComponent />
      </div>
    </div>
  );
};

export default MallPage;

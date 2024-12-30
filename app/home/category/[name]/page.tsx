import AfterFilterCategory from "@/components/modules/categoryPageModules/afterFilter";
import CategoryFilteredContent from "@/components/modules/categoryPageModules/categoryContent";
import SearchBar from "@/components/modules/homePageModule/search";

type UserCategoryPageType = {
  params: Promise<{ name: string }>;
};

const UserCategoryPage = async ({ params }: UserCategoryPageType) => {
  const { name } = await params;
  return (
    <div className="flex  flex-col gap-4 items-center mt-20 w-full relative">
      <div className=" flex flex-col h-96 w-full">
        <div className="inset-0 bg-cover bg-center h-[120%] z-[-1] bg-homePageImage">
          <div className="flex flex-col z-10 items-center justify-center h-full">
            <p className="text-4xl font-bold text-white text-center">
              Search Shops and Malls
            </p>

            <p className="text-2xl font-semibold text-white">100+ shops</p>
          </div>
        </div>
      </div>
      <SearchBar />
      <div className="w-[75%] pl-40 mt-10 flex gap-3 ">
        <AfterFilterCategory name={name} />

        <CategoryFilteredContent name={name} />
      </div>
    </div>
  );
};

export default UserCategoryPage;

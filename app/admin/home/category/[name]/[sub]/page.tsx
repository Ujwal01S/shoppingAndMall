import AfterFilterCategory from "@/components/modules/categoryPageModules/afterFilter";
import SubCategoryContent from "@/components/modules/categoryPageModules/subCategoryContent";
import SearchBar from "@/components/modules/homePageModule/search";

type HomeSubCategoryPageType = {
  params: Promise<{ name: string; sub: string }>;
};

const HomeSubCategoryPage = async ({ params }: HomeSubCategoryPageType) => {
  const { sub } = await params;
  const decodedName = decodeURIComponent((await params).name);
  const decodedSub = decodeURIComponent(sub);
  return (
    <div className="flex  flex-col gap-4 items-center mt-20 w-full relative mb-5">
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
        <AfterFilterCategory name={decodedName} sub={decodedSub} />

        <SubCategoryContent name={sub} />
      </div>
    </div>
  );
};

export default HomeSubCategoryPage;

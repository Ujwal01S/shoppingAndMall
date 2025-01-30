import CategoryContent from "@/components/modules/mallCategoryModules/categoryContent";
import MallSearch from "@/components/modules/userMallModules/mallSearch";

type PropsType = {
  params: Promise<{ name: string }>;
};

const CategoryPage = async ({ params }: PropsType) => {
  const decodedParams = decodeURIComponent((await params).name);
  return (
    <div className="w-full flex flex-col items-center gap-14 pb-8 mt-4">
      <MallSearch title="mall" />

      <CategoryContent initialCategory={decodedParams} route="malls" />
    </div>
  );
};

export default CategoryPage;

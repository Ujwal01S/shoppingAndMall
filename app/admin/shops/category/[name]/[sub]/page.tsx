// cannot have [name]/[name] so change it to [name]/[sub]

import SubCategoryContext from "@/components/modules/subCategoryModules/subCategoryContent";
import MallSearch from "@/components/modules/userMallModules/mallSearch";

interface SubCategoryPageProps {
  params: Promise<{
    name: string;
    sub: string;
  }>;
}

const SubCategoryPage = async ({ params }: SubCategoryPageProps) => {
  const url1 = decodeURIComponent((await params).name);
  const url2 = decodeURIComponent((await params).sub);

  const urlArry = [url1, url2];

  return (
    <div className="w-full flex flex-col items-center gap-4 mb-8 mt-4">
      <MallSearch title="shop" />

      <SubCategoryContext url={url2} urlArry={urlArry} route="shops" />
    </div>
  );
};

export default SubCategoryPage;

import EditMallForm from "@/components/modules/editMallModules/editMall";
import { getMallByName } from "@/lib/api";
import { ShopDataContextProvider } from "@/store/editShopContext";

type EditMallDataPageProps = {
  params: Promise<{ name: string }>;
};

const EditMallDataPage = async ({ params }: EditMallDataPageProps) => {
  const { name: nameOfMall } = await params;
  let data;
  try {
    data = await getMallByName(nameOfMall);
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
    }
  }

  return (
    <ShopDataContextProvider>
      <div className="flex flex-col items-center justify-center mt-24">
        <p className="text-4xl text-brand-text-secondary font-bold mb-14">
          Mall Form
        </p>

        <EditMallForm nameOfMall={nameOfMall} mallDataApi={data} />
      </div>
    </ShopDataContextProvider>
  );
};

export default EditMallDataPage;

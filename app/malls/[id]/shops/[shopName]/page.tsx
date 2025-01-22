import ShopDetailComponent from "@/components/modules/shopPageModules";

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

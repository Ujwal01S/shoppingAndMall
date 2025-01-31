import { auth } from "@/auth";
import DashContent from "@/components/modules/adminDashboardModules/dashContent";
const AdminDashboard = async () => {
  const session = await auth();

  return (
    <div className="relative flex flex-col mt-20">
      <div className=" flex flex-col h-96">
        <div className="inset-0 bg-cover bg-center h-[120%] z-[-1] bg-homePageImage">
          <div className="flex flex-col z-10 items-center justify-center h-full">
            <p className="text-4xl font-bold text-white text-center">
              Search Shops and Malls
            </p>

            <p className="text-2xl font-semibold text-white">100+ shops</p>
          </div>
        </div>
      </div>
      {session?.user.role && <DashContent role={session?.user.role} />}
    </div>
  );
};

export default AdminDashboard;

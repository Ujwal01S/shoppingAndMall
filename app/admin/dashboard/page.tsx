

import { auth } from "@/auth";
import AdminDashboardContent from "@/components/modules/adminDashboardModules";
import SearchBar from "@/components/modules/homePageModule/search";
import { redirect } from "next/navigation";


const AdminDashboard = async() => {
    const session = await auth();

    if(!session?.user.isAdmin){
        redirect("/")
    }
  return (
    <div className="relative flex flex-col">
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

      <div className="container mt-8">
      <SearchBar />
      <AdminDashboardContent />

      </div>
    </div>
  );
};

export default AdminDashboard;

import ShopFilters from "../homePageModule/shopFilters";
import AdminMallAndShops from "./adminMallAndShop";


const AdminDashboardContent = () => {
    return ( 
        <div className="flex gap-4 px-40 py-10">
            <ShopFilters />

            <AdminMallAndShops />
        </div>
     );
}
 
export default AdminDashboardContent;
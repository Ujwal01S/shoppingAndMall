
import MallsAndShops from "../mallsAndShops";
import ShopFilters from "../shopFilters";


const HomepageContent = () => {

    return ( 
        <div className="flex gap-4 px-40 py-10">
            <ShopFilters />

            <MallsAndShops />
        </div>
     );
}
 
export default HomepageContent;
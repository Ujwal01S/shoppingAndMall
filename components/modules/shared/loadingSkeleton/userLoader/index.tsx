import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const UserLoader = () => {
  return (
    <div className="w-full pl-60">
      <div className="w-[60%] flex flex-col items-center justify-center mt-24">
        <div className="my-8 flex flex-col gap-4 w-[60%]">
          <p className="text-3xl text-brand-text-secondary font-bold">Users</p>
          <div className=" w-fit mt-2 rounded-none bg-brand-text-footer text-white p-2">
            <p>Add New User</p>
          </div>
        </div>

        <Skeleton count={8} height={14} width={800} />
      </div>
    </div>
  );
};

export default UserLoader;

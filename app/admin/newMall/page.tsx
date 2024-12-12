"use client"
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect } from "react";


const NewMallPage = () => {
    const {data:session} = useSession();

    useEffect(() => {
        if(!session) return;
        if (!session?.user.isAdmin) {
          redirect("/");
        }
        if(session.user.role === 'user'){
          redirect("/")
        }
      }, [session]);
    return ( 
        <div className="w-full h-screen flex flex-col items-center justify-center">
        <p className="text-4xl text-brand-text-secondary font-bold">This is Mall Form page</p>
        <p className="text-lg font-bold">Coming Soon...</p>
        <p></p>
    </div>
     );
}
 
export default NewMallPage;
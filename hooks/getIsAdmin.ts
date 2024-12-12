import { auth } from "@/auth"



export const getAdminStatus = async() => {
    const session = await auth()
    return session?.user.role;
}
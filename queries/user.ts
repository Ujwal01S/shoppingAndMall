

import { User } from "@/model/user";

interface UserProps {
    name:string,
    email:string,
    password:string
}


export async function createUser(userData:UserProps){
    try {
        const newUser = await User.create(userData);
        return newUser
    } catch (error) {
        if(error instanceof Error){
            throw new Error(error.message)
        }else{
            throw new Error("An unknow error occurs while creating the user");
        }
    }
}

export async function getUserByName(name:string){
    const user = await User.findOne({name:name}).select("-password").lean();
    return user;
}

export async function getUserById(id:string){
    const user = await User.findById(id).select("-password").lean();
    return user;
}
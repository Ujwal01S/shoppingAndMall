"use server"

import { User } from "@/model/user";

export const updateRole = async (newRole: string, id: string) => {
    // console.log(newRole)

    try {
        const updateRole = newRole;

        await User.findByIdAndUpdate(id, { role: updateRole });
    } catch (error) {
        if (error instanceof Error) {
            throw new Error("Error while updating")
        }
    }
}
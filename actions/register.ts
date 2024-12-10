"use server"

import bcrypt from 'bcryptjs'

import { RegisterSchema } from '@/schemas';
import * as z from 'zod'
import { db } from '@/lib/mogo';
import { createUser } from '@/queries/user';

export const register = async(data:z.infer<typeof RegisterSchema>) => {
    const validatedFields = RegisterSchema.safeParse(data);

    if(!validatedFields.success){
        return {error:"Invalid fields!"};
    }

    const {email,name,password} = validatedFields.data


    // try {
    //     const response = await fetch(`http://localhost:3000/api/register`, {
    //       method: "POST",
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //       body: JSON.stringify({
    //         name,
    //         email,
    //         password,
    //       }),
    //     });
  
    //     if(response.status === 201){
    //       console.log("first")
    //     }
    //   } catch (error) {
    //     console.log(error);
    //   }

    await db();

    const hashedPassword = await bcrypt.hash(password, 5);

    const newUser = {
        name,
        password:hashedPassword,
        email
    }

    try {
        await createUser(newUser);
    } catch (error) {
        if(error instanceof Error){
            throw new Error(error.message)
        }else{
            throw new Error("Something went wrong")
        }
    }

    return {success:"User has been registered!"}
};
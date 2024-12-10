
import * as z from 'zod'


export const LoginSchema = z.object({
    name:z.string().min(2,{
        message:"Email is required",
    }),
    password:z.string().min(1,{
        message:"Password is required",
    })
});


export const RegisterSchema = z.object({
    name:z.string().min(5,{
        message:"Name is requried"
    }),
    email:z.string().email({
        message:"Email is required"
    }),
    password:z.string().min(5,{
        message:"Password is required"
    })
});

import { NextResponse } from "next/server";
import { createUser } from "@/queries/user";
import { db } from "@/lib/mogo";
import bycrypt from 'bcryptjs'

interface RequestBody {
  name: string;
  email: string;
  password: string;
}

export const POST = async (request: Request) => {
  try {

    const { name, email, password }: RequestBody = await request.json();

    console.log(name, email, password);

    await db();

    const hashedPassword = await bycrypt.hash(password, 5);

    const newUser = {
        name,
        password:hashedPassword,
        email
    };

    try {
        await createUser(newUser);
    } catch (error) {
        if(error instanceof Error)
        return new NextResponse(error.message, {status:500})
    }

    return new NextResponse("User has been created", { status: 201 });
  } catch (error) {
    console.error("Error parsing request body:", error);
    return new NextResponse("Invalid request", { status: 400 });
  }
};

import { NextResponse } from "next/server";
import { db } from "@/lib/mogo";
import bycrypt from "bcryptjs";
import { User } from "@/model/user";

interface RequestBody {
  name: string;
  password: string;
}

export const POST = async (request: Request) => {
  try {
    const { name, password }: RequestBody = await request.json();

    // console.log(name, password);

    await db();

    const hashedPassword = await bycrypt.hash(password, 5);

    // const newUser = {
    //   name,
    //   password: hashedPassword,
    // };

    try {
      await User.create({
        name: name,
        password: hashedPassword,
      });
    } catch (error) {
      if (error instanceof Error)
        return new NextResponse(error.message, { status: 500 });
    }

    return new NextResponse("User has been created", { status: 201 });
  } catch (error) {
    console.error("Error parsing request body:", error);
    return new NextResponse("Invalid request", { status: 400 });
  }
};

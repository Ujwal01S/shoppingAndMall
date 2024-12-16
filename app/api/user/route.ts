import { db } from "@/lib/mogo";
import { UploadImage } from "@/lib/uploadImage";
import { User } from "@/model/user";
import { NextRequest, NextResponse } from "next/server";
import bycrypt from 'bcryptjs'

export const GET = async () => {
  const users = await User.find({});

  return NextResponse.json({ users, total: users.length });
};

export const POST = async (req: NextRequest) => {
  const formData = await req.formData();

  const name = formData.get("name");
  const password = formData.get("password") as string;
  const image = formData.get("image") as unknown as File;
  const role = formData.get("role");
  const email = formData.get("email");

  const hashedPassword = await bycrypt.hash(password, 5);

  await db();

  const data = await UploadImage(image, "Shops And Malls");
  await User.create({
    name: name,
    imageUrl: data?.secure_url,
    publicId: data?.public_id,
    password: hashedPassword,
    role: role,
    email: email,
  });


  return NextResponse.json({ success: true }, { status: 200 });
};

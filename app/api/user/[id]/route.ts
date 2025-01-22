import { db } from "@/lib/mogo";
import { UploadImage } from "@/lib/uploadImage";
import { User } from "@/model/user";
import { NextRequest, NextResponse } from "next/server";

type UpdatedUserProps = {
  name?: string
  password?: string
  isAdmn?: boolean
  imageUrl?: string
  publicId?: string
}

export const DELETE = async (
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) => {
  const { id } = await context.params;
  await db();

  try {
    await User.findByIdAndDelete(id);
  } catch (error) {
    console.log(error);
  }

  return NextResponse.json({ status: 200 });
};


export const GET = async (req: NextRequest, context: { params: Promise<{ id: string }> }) => {
  const { id } = await context.params;
  await db()
  let user;
  try {
    user = await User.findById(id)
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 })
    } else {
      return NextResponse.json({ message: "Something went wron" })
    }
  }
  return NextResponse.json({ user: user }, { status: 200 });
}

export const PUT = async (req: NextRequest, context: { params: Promise<{ id: string }> }) => {
  const { id } = await context.params
  // console.log(id);
  const formData = await req.formData();

  const name = formData.get("name");
  // const password = formData.get("password");
  const email = formData.get("email");
  const role = formData.get("role");
  const formImage = formData.get("image") as unknown as File | string



  let filteredImage;
  if (typeof formImage === 'string') {
    // console.log("HERE")
    filteredImage = formImage
  } else {
    // console.log('here in file')
    const data = await UploadImage(formImage, "Shops And Malls");
    filteredImage = data?.secure_url;
    // console.log(filteredImage);
  }

  const payload = {
    name, imageUrl: filteredImage, role, email,
  }

  // console.log("From route:", payload)

  await db()
  let updatedUser: UpdatedUserProps | null;
  try {
    updatedUser = await User.findByIdAndUpdate(id, payload)
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ message: "Something went wrong" });
    }
  }
  return NextResponse.json({ user: updatedUser }, { status: 200 });
}
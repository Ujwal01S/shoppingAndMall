import { db } from "@/lib/mogo";
import { UploadImage } from "@/lib/uploadImage";
import { ImageModel } from "@/model/image";
import { NextRequest, NextResponse } from "next/server";

interface UploadImageResponse {
  secure_url: string;
  public_id: string;
}

export const GET = async () => {
  const Images = await ImageModel.find({});

  return NextResponse.json({ images: Images, total: Images.length });
};

export const POST = async (req: NextRequest) => {
  const formData = await req.formData();

  const image = formData.get("image") as unknown as File;

  await db();

  const data: UploadImageResponse = await UploadImage(
    image,
    "Demo-Shops-And-Malls"
  );

  await ImageModel.create({
    imageUrl: data?.secure_url,
    publicId: data?.public_id,
  });

  return NextResponse.json(
    { msg: image },
    {
      status: 200,
    }
  );
};

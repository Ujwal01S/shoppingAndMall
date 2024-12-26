import { db } from "@/lib/mogo";
import { UploadImage } from "@/lib/uploadImage";
import { Mall } from "@/model/mall";
import { NextRequest, NextResponse } from "next/server";


export const GET = async () => {
    const malls = await Mall.find({});

    return NextResponse.json(malls);
}

export const POST = async (req: NextRequest) => {

    try {
        const formData = await req.formData();
        const name = formData.get("name");
        const address = formData.get("address");
        const level = formData.get("level");
        const phone = formData.get("phone");
        const openTime = formData.get("openTime");
        const closeTime = formData.get("closeTime");
        const image = formData.get("image") as unknown as File;
        const shopId = formData.getAll("shopId");

        // console.log("ImageCLg", image);
        await db();
        if (!address || !level || !name || !phone || !image) {
            return NextResponse.json({ message: "All fields are required" }, { status: 500 })
        }

        const imageData = await UploadImage(image, "Malls");

        const mall = await Mall.create({
            name: name,
            imageUrl: imageData.secure_url,
            address,
            level,
            phone,
            openTime,
            closeTime,
            shops: shopId
        })

        // console.log("MallID:", mall._id);

        return NextResponse.json({ message: "Mall Form Data successfully updated!", mallId: mall._id }, { status: 200 });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ message: "Error while posting mall!!" }, { status: 400 });
        } else {
            return NextResponse.json({ message: "Unexpected Error occured!" }, { status: 500 })
        }
    }
}
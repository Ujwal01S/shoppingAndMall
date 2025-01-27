import { db } from "@/lib/mogo";
import { UploadImage } from "@/lib/uploadImage";
import { Category } from "@/model/category";
// import { Category } from "@/model/category";
import { Mall } from "@/model/mall";
import { Shop } from "@/model/shop";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest, context: { params: Promise<{ name: string }> }) => {

    const { name: id } = await context.params

    // console.log("name:", id);

    if (!id) {
        return NextResponse.json({ message: "Name parameter is missing" }, { status: 400 });
    }

    // const decodedName = decodeURIComponent(name).trim();
    // console.log("Decoded Name:", decodedName);

    await db();

    try {

        const shop = await Shop.findById(id);

        if (!shop) {
            return NextResponse.json({ message: "Shop not found" }, { status: 404 });
        }

        return NextResponse.json(shop);
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ message: "Error while finding data" }, { status: 400 });
        } else {
            return NextResponse.json({ message: "Something went wrong!" });
        }
    }
};


export const DELETE = async (req: NextRequest, context: { params: Promise<{ name: string }> }) => {
    const { name: id } = await context.params;
    try {
        const shop = await Shop.findById(id);
        const mallName = shop.mallName;
        await Shop.findByIdAndDelete(id);

        await Mall.updateOne(
            { name: mallName },
            { $pull: { shops: id } }
        );

        const mall = await Mall.findOne({ name: mallName });

        await Category.updateOne(
            { category: shop.category },
            { $pull: { malls: mall._id } },
        )
        return NextResponse.json({ message: "Shop Successfully Deleted!" }, { status: 200 });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ message: "Error while deleting shop" }, { status: 400 });
        } else {
            return NextResponse.json({ message: "Something whent wrong" })
        }

    }
}


export const PUT = async (req: NextRequest, context: { params: Promise<{ name: string }> }) => {
    const { name: id } = await context.params;

    try {
        const formData = await req.formData();
        const name = formData.get("name");
        const level = formData.get("level");
        const phone = formData.get("phone");
        const category = formData.get("category");
        const subCategory = formData.get("subCategory");
        const openTime = formData.get("openTime");
        const closeTime = formData.get("closeTime");
        const description = formData.get("description");
        const mallName = formData.get("mallName");
        const images = formData.getAll("image");
        const video = formData.get("video");

        const arrayOfShopImages: string[] = [];

        // console.log("Image from put", images);

        const uploadPromises = images.map(async (image) => {
            if (typeof image === 'string') {
                arrayOfShopImages.push(image)
                console.log("imageReached")
            } else {
                const imageData = await UploadImage(image as unknown as File, "shops")
                arrayOfShopImages.push(imageData.secure_url);
            }
        });

        await Promise.all(uploadPromises);

        // console.log(video)
        // console.log("type:", typeof video)
        let videoUrl: string | undefined = undefined;
        if (video) {
            if (typeof video === "string") {
                videoUrl = video
                console.log("videoReached");
            } else {
                const videoData = await UploadImage(video as unknown as File, "Shop-video");
                videoUrl = videoData.secure_url;
                console.log("URLVIDEO");
            }
        }

        // console.log("image in URL:", arrayOfShopImages);

        const payload = {
            name,
            level,
            phone,
            category,
            subCategory,
            openTime,
            closeTime,
            description,
            image: arrayOfShopImages,
            mallName,
            ...(videoUrl ? { video: videoUrl } : {})
        }

        // console.log("Payload data:", payload);

        await Shop.findByIdAndUpdate(id, payload)

        return NextResponse.json({ message: "Shop Successfully updated!!", shopId: id })
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ message: "Error while updating Shop!" });
        }
    }
}
import { db } from "@/lib/mogo";
import { UploadImage } from "@/lib/uploadImage";
import { Category } from "@/model/category";
import { Mall } from "@/model/mall";
import { Shop } from "@/model/shop";
import { NextRequest, NextResponse } from "next/server";


export const GET = async (req: NextRequest, context: { params: Promise<{ name: string }> }) => {

    const { name: id } = await context.params
    if (!id) {
        return NextResponse.json({ message: "Id parameter is missing" }, { status: 400 });
    }
    await db();
    try {

        const shop = await Shop.findById(id);

        const mall = await Mall.findOne({
            shops: id
        })

        if (!shop) {
            return NextResponse.json({ message: "Shop not found" }, { status: 404 });
        }

        return NextResponse.json({ shop, mallOpenTime: mall.openTime, mallCloseTime: mall.closeTime, level: mall.level });
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

        if (!shop) {
            return NextResponse.json(
                { message: "Shop not found" },
                { status: 404 }
            );
        }

        const { mallName, category } = shop;

        const noOfShopsWithCategory = await Shop.find({
            mallName,
            category
        });


        await Shop.findByIdAndDelete(id);


        await Mall.updateOne(
            { name: mallName },
            { $pull: { shops: id } }
        );

        if (noOfShopsWithCategory.length === 1) {
            const mall = await Mall.findOne({ name: mallName });
            if (mall) {
                await Category.updateOne(
                    { category },
                    { $pull: { malls: mall._id } }
                );
            }
        }

        return NextResponse.json(
            { message: "Shop Successfully Deleted!" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Delete shop error:", error);
        return NextResponse.json(
            { message: "Error while deleting shop" },
            { status: 500 }
        );
    }
}


export const PUT = async (req: NextRequest, context: { params: Promise<{ name: string }> }) => {
    const { name: id } = await context.params;


    const oldShop = await Shop.findById(id);

    const oldCategory = oldShop.category;

    // console.log({ oldCategory });


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

        if (oldCategory !== category) {
            const mall = await Mall.findOne({ name: mallName });

            const { category } = oldShop

            const noOfShopsWithCategory = await Shop.find({
                mallName,
                category
            });

            // console.log("Here");
            if (noOfShopsWithCategory.length === 1) {
                await Category.updateOne(
                    { category: oldCategory },
                    { $pull: { malls: mall._id } }
                )
            }

            await Category.updateOne(
                { category: category },
                { $push: { malls: mall._id } }
            )
        }

        return NextResponse.json({ message: "Shop Successfully updated!!", shopId: id })
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ message: "Error while updating Shop!" });
        }
    }
}
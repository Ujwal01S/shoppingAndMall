import { UploadImage } from "@/lib/uploadImage";
import { Shop } from "@/model/shop";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
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
        const images = formData.getAll("image");

        // console.log("From API Shop", images);

        if (!name || !level || !phone || !category || !description) {
            // console.log("Missing required fields");
            return NextResponse.json({ message: "All Fields are required" });
        }

        const arrayOfShopImage: string[] = [];
        const uploadPromises = images.map(async (image) => {
            // console.log("Uploading image:", image);
            const imageData = await UploadImage(image as unknown as File, "Shops");
            // console.log("Uploaded image data:", imageData);
            arrayOfShopImage.push(imageData.secure_url);
        });

        await Promise.all(uploadPromises);

        // console.log("Uploaded Images:", arrayOfShopImage);

        // console.log("after upload Image")

        await Shop.create({
            name,
            level,
            phone,
            category,
            subCategory,
            openTime,
            closeTime,
            description,
            image: arrayOfShopImage
        })

        return NextResponse.json({ message: "Shop created successfully" });

    } catch (error) {
        console.error("Error creating shop:", error);
        return NextResponse.json({ message: "Error creating shop" });
    }
}
import { UploadImage } from "@/lib/uploadImage";
import { Mall } from "@/model/mall";
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
        const mallName = formData.get("mallName");
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

        // promise .all so that all the array of image.secure_url gets push to arrayOfShopImages cuz uploadImage is async function
        await Promise.all(uploadPromises);

        const shop = await Shop.create({
            name,
            level,
            phone,
            category,
            subCategory,
            openTime,
            closeTime,
            description,
            image: arrayOfShopImage,
            mallName,
            // mallId: mallObjectId
        })

        console.log("ShopId", shop._id);

        // if you want to push new data than update is to be used unlike in shop where you pull id that doesn't require update

        await Mall.findOneAndUpdate(
            { name: mallName },
            { $push: { shops: shop._id } },
            { new: true } // This option returns the modified document
        );

        // console.log("mall", mall);


        return NextResponse.json({ message: "Shop Added Sucessfully!", shopId: shop._id }, { status: 200 });

    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ message: "Error while posting shop" }, { status: 400 });
        } else {
            return NextResponse.json({ message: "Something whent wrong" })
        }
    }

}
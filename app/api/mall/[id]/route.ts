import { db } from "@/lib/mogo";
import { UploadImage } from "@/lib/uploadImage";
import { Mall } from "@/model/mall";
// import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest, { params }: { params: { id: string } }) => {

    const { id } = await params;
    await db();

    let mallData;
    try {
        mallData = await Mall.findById(id).populate("shops")
    } catch (error) {
        console.error("Error fetching mall with shops:", error);
        return NextResponse.json({ message: "Error fetching data" }, { status: 500 });
    }

    if (!mallData) {
        return NextResponse.json({ message: "Mall not found" }, { status: 404 });
    }

    return NextResponse.json(mallData);
};

export const DELETE = async (req: NextRequest, { params }: { params: { id: string } }) => {
    const { id } = await params;

    try {
        await Mall.findByIdAndDelete(id);
        return NextResponse.json({ message: "Mall Successfully Removed!" }, { status: 200 });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ message: "Error while deleting Mall" }, { status: 400 });
        } else {
            return NextResponse.json({ message: "Something when wrong!!" });
        }
    }
}


export const PUT = async (req: NextRequest, { params }: { params: { id: string } }) => {
    const { id } = await params;

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
        await db();

        let imageUrl: string;
        if (typeof image === "string") {
            imageUrl = image
        } else {
            const imageData = await UploadImage(image, "Malls");
            imageUrl = imageData.secure_url
        }

        const payload = {
            name,
            imageUrl: imageUrl,
            address,
            level,
            phone,
            openTime,
            closeTime,
            shops: shopId
        }

        await Mall.findByIdAndUpdate(id, payload);

        return NextResponse.json({ message: "Successfully updated mall" }, { status: 200 });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ message: "Error while updating Mall" }, { status: 400 });
        } else {
            return NextResponse.json({ message: "Unexpected Error has occured!" });
        }
    }
}
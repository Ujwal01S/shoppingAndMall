import { db } from "@/lib/mogo";
import { Mall } from "@/model/mall";
import { Shop } from "@/model/shop";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest, { params }: { params: { name: string } }) => {

    const { name } = await params

    // console.log("name:", name);

    if (!name) {
        return NextResponse.json({ message: "Name parameter is missing" }, { status: 400 });
    }

    const decodedName = decodeURIComponent(name).trim();
    // console.log("Decoded Name:", decodedName);

    await db();

    try {

        const shop = await Shop.findOne({
            name: decodedName
        });

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


export const DELETE = async (req: NextRequest, { params }: { params: { name: string } }) => {
    const { name: id } = await params;
    try {
        const shop = await Shop.findById(id);
        const mallName = shop.mallName;
        await Shop.findByIdAndDelete(id);

        await Mall.updateOne(
            { name: mallName },
            { $pull: { shops: id } }
        );
        return NextResponse.json({ message: "Shop Successfully Deleted!" }, { status: 200 });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ message: "Error while deleting shop" }, { status: 400 });
        } else {
            return NextResponse.json({ message: "Something whent wrong" })
        }

    }
}
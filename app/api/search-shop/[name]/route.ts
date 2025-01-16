import { Shop } from "@/model/shop";
import { NextRequest, NextResponse } from "next/server";



export const GET = async (req: NextRequest, { params }: { params: { name: string } }) => {
    const { name } = await params;

    try {
        const shops = await Shop.find({
            name: { $regex: name, $options: "i" }
        })
        if (shops) {
            return NextResponse.json(shops, { status: 200 });
        }
        if (!shops) {
            return NextResponse.json({ message: "Shops not found!" });
        }
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ message: "Error while searching for shop!" }, { status: 500 });
        } else {
            return NextResponse.json({ message: "Unexpected Error occured!" });
        }
    }
}
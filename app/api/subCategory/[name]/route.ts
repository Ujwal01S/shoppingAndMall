import { Shop } from "@/model/shop";
import { NextRequest, NextResponse } from "next/server";


export const GET = async (req: NextRequest, { params }: { params: { name: string } }) => {
    const { name } = await params;

    const decodedName = decodeURIComponent(name);

    try {
        const shops = await Shop.find({ subCategory: decodedName });

        if (!shops) {
            return NextResponse.json({ message: "Shop not found" }, { status: 204 });
        }

        return NextResponse.json(shops, { status: 200 });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ message: `Error while getting shops of subCategory ${decodedName}` }, { status: 500 });
        } else {
            return NextResponse.json({ message: "Unexpected Error occured" });
        }
    }
}
import { db } from "@/lib/mogo";
import { Mall } from "@/model/mall";
import { NextRequest, NextResponse } from "next/server";



export const GET = async (req: NextRequest, context: { params: Promise<{ name: string }> }) => {
    const { name } = await context.params;
    const decodedName = decodeURIComponent(name).trim()
    await db();
    try {
        const mall = await Mall.findOne({ name: decodedName }).populate("shops");

        return NextResponse.json(mall, { status: 200 });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ message: "Error while getting mall with name" }, { status: 400 })
        } else {
            return NextResponse.json({ message: "Unexpected Error Occured" }, { status: 500 })
        }
    }
}
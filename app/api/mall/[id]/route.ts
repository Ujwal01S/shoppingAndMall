import { db } from "@/lib/mogo";
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

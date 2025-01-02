import { Category } from "@/model/category";
import { NextRequest, NextResponse } from "next/server";

export type CategoryType = {
    category: string;
    subCategory?: string[];
}

export const GET = async () => {
    try {
        const categories = await Category.find({});
        return NextResponse.json({ message: "Category Successfuly Get", categories }, { status: 200 });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ message: "Error while getting category" }, { status: 400 });
        } else {
            return NextResponse.json({ message: "Unexpected Error has occured" }, { status: 500 })
        }
    }
}

export const POST = async (req: NextRequest) => {
    const { category, subCategory }: CategoryType = await req.json();

    if (!category) {
        return NextResponse.json({ message: "Category is required" }, { status: 400 });
    }

    try {
        const categories = await Category.create({
            category,
            subCategory
        })
        return NextResponse.json({ message: "Category has been created", categories }, { status: 200 })
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ message: "Error while creating category" });
        } else {
            return NextResponse.json({ message: "Unexpected Error occured!" });
        }
    }
}
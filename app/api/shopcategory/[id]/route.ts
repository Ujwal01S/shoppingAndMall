import { Category } from "@/model/category";
import { NextRequest, NextResponse } from "next/server";
import { CategoryType } from "../route";



export const DELETE = async (req: NextRequest, context: { params: Promise<{ id: string }> }) => {
    const { id } = await context.params;

    // console.log(id);
    try {

        const category = await Category.findById(id);

        if (category.malls?.length > 0) {
            return NextResponse.json({ message: `Category ${category.category} is being used by other shops. Hence can't delete the category` }, { status: 409 });
        }

        await Category.findByIdAndDelete(id);
        // The correct status code for a successful deletion is 204 No Content instead of 200 OK. This indicates that the request was successful and the server has no content to return.

        // correction when 204 status is added it throws error
        return NextResponse.json({ message: "Category Successfully deleted" }, { status: 200 });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ message: "Error while deleting category" }, { status: 500 })
        } else {
            return NextResponse.json({ message: "UnexpectedError occured" }, { status: 500 });
        }
    }
}


export const PUT = async (req: NextRequest, context: { params: Promise<{ id: string }> }) => {
    const { id } = await context.params;
    const { category, subCategory }: CategoryType = await req.json()

    if (!category) {
        return NextResponse.json({ message: "Category is required" }, { status: 400 });
    }

    const payload = {
        category,
        subCategory
    }

    try {
        const updatedCategory = await Category.findByIdAndUpdate(id, payload, { new: true });
        return NextResponse.json({ message: "Category is updated", updatedCategory }, { status: 200 });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ message: "Error while deleting category" }, { status: 500 })
        } else {
            return NextResponse.json({ message: "UnexpectedError occured" }, { status: 500 });
        }
    }
}
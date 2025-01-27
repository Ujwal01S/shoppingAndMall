
import { ShopTypes } from '@/app/malls/[id]/page';
import { Category } from '@/model/category';
import { Mall } from '@/model/mall';
import { NextRequest, NextResponse } from 'next/server';

export interface FullShops extends ShopTypes {
    category: string;
    subCategory?: string;
}

export const GET = async (req: NextRequest, context: { params: Promise<{ slug: string[] }> }) => {
    const { slug } = await context.params;
    const categoryFromParams = slug[0];
    const searchTerm = slug[1];


    try {

        const category = await Category.findOne({ category: categoryFromParams });
        if (category) {
            // Get all mall IDs in that category
            const mallIds = category.malls;
            //  Query the Mall collection using the mall IDs and search term
            const malls = await Mall.find({
                // Filter malls by their IDs
                '_id': { $in: mallIds },
                // Search malls by name using case-insensitive regex
                'name': { $regex: searchTerm, $options: 'i' }
            }).populate("shops");

            let mallData;
            if (Array.isArray(malls) && malls.length > 0) {
                mallData = malls.map((data) => {
                    return {
                        address: data.address,
                        _id: data._id,
                        closeTime: data.closeTime,
                        openTime: data.openTime,
                        phone: data.phone,
                        imageUrl: data.imageUrl,
                        level: data.level,
                        name: data.name
                    };
                });
            }
            let shops;
            if (Array.isArray(malls) && malls.length > 0) {
                shops = malls.map((data) => {
                    if (Array.isArray(data.shops) && data.shops.length > 0) {
                        return data.shops.map((data: ShopTypes) => {
                            return {
                                // category: data.category,
                                _id: data._id,
                                closeTime: data.closeTime,
                                openTime: data.openTime,
                                // level: data.level,
                                phone: data.phone,
                                image: data.image,
                                mallName: data.mallName,
                                // subCategory: data.subCategory,
                                // description: data.description
                            };
                        });
                    }
                    return [];
                }).flat(); //.flat() is used to change [[{}]] formate into [{}]
            }


            if (malls.length > 0) {
                return NextResponse.json({ shops, mallData }, { status: 200 });
            } else {
                return NextResponse.json({ message: "No malls found matching the search term" }, { status: 404 });
            }
        } else {
            return NextResponse.json({ message: "Category not found" }, { status: 404 });
        }

    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ message: "Error while getting malls from category" }, { status: 500 });
        } else {
            return NextResponse.json({ message: "Unexpected Error occurred" }, { status: 500 });
        }
    }
};

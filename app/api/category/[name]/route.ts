import { Mall } from "@/model/mall";
import { Shop } from "@/model/shop";
import { NextRequest, NextResponse } from "next/server";

export type ShopsTypes = {
    _id: string;
    name: string;
    level: string
    phone: string
    category: string
    subCategory: string
    openTime: string
    closeTime: string
    description: string
    image: string[]
    mallName: string
}

export type MallTypes = {
    _id: string
    name: string
    address: string
    level: string
    phone: string
    imageUrl: string
    openTime: string
    closeTime: string
    shops: string[]
}


export const GET = async (req: NextRequest, context: { params: Promise<{ name: string }> }) => {
    const { name } = await context.params;
    const decodedCateogry = decodeURIComponent(name);

    const shops = await Shop.find({ category: decodedCateogry });

    const getMallNames = (shops: ShopsTypes[]) => {
        return shops.map(shop => shop.mallName);
    };

    const mallNames = getMallNames(shops);

    const filteredNames = mallNames.filter((name, index) => mallNames.indexOf(name) === index);

    // console.log(filteredNames);


    const mallData: MallTypes[] = await Promise.all(
        filteredNames.map(async (singleMall) => {
            const mall = await Mall.find({ name: singleMall });
            return mall[0];
        })
    );

    // console.log({ mallData, shops });



    return NextResponse.json({ shops, mallData }, { status: 200 });
}
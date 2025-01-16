import { Shop } from "@/model/shop";
import { NextRequest, NextResponse } from "next/server";
import { MallTypes, ShopsTypes } from "../../category/[name]/route";
import { Mall } from "@/model/mall";


export const GET = async (req: NextRequest, { params }: { params: { name: string } }) => {
    const { name } = await params;

    const decodedSubCategory = decodeURIComponent(name);
    try {

        const shops = await Shop.find({ subCategory: decodedSubCategory });

        const getMallNames = (shops: ShopsTypes[]) => {
            return shops.map(shop => shop.mallName);
        };

        const mallNames = getMallNames(shops);

        const mallData: MallTypes[] = await Promise.all(
            mallNames.map(async (singleMall) => {
                const mall = await Mall.find({ name: singleMall });
                return mall[0];
            })
        );

        return NextResponse.json({ shops, mallData });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ message: "Error while getting category" }, { status: 500 })
        } else {
            return NextResponse.json({ message: "Unexpected Error!" })
        }
    }
}
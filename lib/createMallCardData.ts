import { ShopsTypes } from "@/app/api/category/[name]/route";


export const createMallCardData = (shopData: ShopsTypes[]) => {

    if (!Array.isArray(shopData)) {
        return [];
    }

    return Array.isArray(shopData) &&
        shopData.map((shop: ShopsTypes) => ({
            _id: shop._id,
            name: shop.name,
            openTime: shop.openTime,
            closeTime: shop.closeTime,
            address: shop.mallName,
            phone: shop.phone,
            imageUrl: shop.image ? shop.image[0] : undefined,
        }));

}
export type ShopDataType = {
    name: string;
    level: number;
    phone: string;
    description: string;
    category: string;
    subCategory?: string | null;
    image?: (File | string)[];
    openTime: string;
    closeTime: string;
    id?: string | null;
    mallName?: string;
    video?: (File | string)[];
};

export const createNewShopFormData = (shopData: ShopDataType, mallName: string) => {
    const formData = new FormData();
    formData.append("name", shopData.name);
    formData.append("level", shopData.level.toString());
    formData.append("phone", shopData.phone);
    formData.append("openTime", shopData.openTime);
    formData.append("closeTime", shopData.closeTime);
    formData.append("description", shopData.description);
    formData.append("category", shopData.category);
    formData.append("subCategory", shopData.subCategory || '');
    formData.append("mallId", shopData.id || '');
    formData.append("mallName", mallName);

    if (shopData.image && shopData.image.length > 0) {
        shopData.image.forEach((file) => {
            formData.append("image", file);
        });
    }

    if (shopData.video && shopData.video.length > 0) {
        shopData.video.forEach((file) => {
            formData.append("video", file);
        })
    }

    return formData;
}
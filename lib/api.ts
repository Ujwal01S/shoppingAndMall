import axios from "axios"

export const deleteMallApi = async (id: string) => {
    const response = await axios.delete(`/api/mall/${id}`)
    return response;
}

export const deleteShopApi = async (id: string) => {
    const response = await axios.delete(`/api/shop/${id}`);
    return response;
}

export const getShopAndMallWithCategory = async (category: string) => {
    const { data } = await axios.get(`/api/category/${category}`);
    return data;
}

export const addShop = async (shopData: FormData) => {
    const response = await axios.post(`/api/addshop`, shopData);
    return response;
}


export const updateShop = async (id: string, shopData: FormData) => {
    const response = await axios.put(`/api/shop/${id}`, shopData);
    return response;
}
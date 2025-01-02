import { CategoryType } from "@/app/api/shopcategory/route";
import axios from "axios"


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

// Mall APi
export const deleteMallApi = async (id: string) => {
    const response = await axios.delete(`/api/mall/${id}`)
    return response;
}

export const getMallByName = async (name: string) => {
    const { data } = await axios.get(`/api/singlemall/${name}`);
    return data;
}

export const updateMallByName = async (id: string, mallData: FormData) => {
    const response = await axios.put(`/api/mall/${id}`, mallData);
    return response;
}

// search Mall API

export const searchMall = async (name: string) => {
    const { data } = await axios.get(`/api/search/${name}`);
    return data;
}

// category APIS

export const postCategoryData = async (categoryData: CategoryType) => {
    const response = await axios.post(`/api/shopcategory`, categoryData);
    return response;
}

export const getAllCategory = async () => {
    const { data } = await axios.get(`/api/shopcategory`);
    return data;
}

export const editCategoryData = async (id: string, categoryData: CategoryType) => {
    const response = await axios.put(`/api/shopcategory/${id}`, categoryData);
    return response
}


export const deleteCategory = async (id: string) => {
    const response = await axios.delete(`/api/shopcategory/${id}`);
    return response;
}
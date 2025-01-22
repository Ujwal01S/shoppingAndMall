import { CategoryType } from "@/app/api/shopcategory/route";
import axios from "axios"
import { BASE_API_URL } from "./constant";


export const deleteShopApi = async (id: string) => {
    const response = await axios.delete(`${BASE_API_URL}/api/shop/${id}`);
    return response;
}

export const getShopAndMallWithCategory = async (category: string) => {
    const { data } = await axios.get(`${BASE_API_URL}/api/category/${category}`);
    return data;
}

export const addShop = async (shopData: FormData) => {
    const response = await axios.post(`${BASE_API_URL}/api/addshop`, shopData);
    return response;
}


export const updateShop = async (id: string, shopData: FormData) => {
    const response = await axios.put(`${BASE_API_URL}/api/shop/${id}`, shopData);
    return response;
}

// Mall APi
export const deleteMallApi = async (id: string) => {
    const response = await axios.delete(`${BASE_API_URL}/api/mall/${id}`)
    return response;
}

export const getMallByName = async (name: string) => {
    const { data } = await axios.get(`${BASE_API_URL}/api/singlemall/${name}`);
    return data;
}

export const getSingleMallDataWithShop = async (id: string) => {
    const { data } = await axios.get(`${BASE_API_URL}/api/mall/${id}`);
    return data;
};

export const getSingleShop = async (name: string) => {
    const { data } = await axios.get(`${BASE_API_URL}/api/shop/${name}`);
    return data;
};

export const updateMallByName = async (id: string, mallData: FormData) => {
    const response = await axios.put(`${BASE_API_URL}/api/mall/${id}`, mallData);
    return response;
}

// search Mall API

export const searchMall = async (name: string) => {
    const { data } = await axios.get(`${BASE_API_URL}/api/search/${name}`);
    return data;
}

// category APIS

export const postCategoryData = async (categoryData: CategoryType) => {
    const response = await axios.post(`${BASE_API_URL}/api/shopcategory`, categoryData);
    return response;
}

export const getAllCategory = async () => {
    const { data } = await axios.get(`${BASE_API_URL}/api/shopcategory`);
    return data;
}

export const editCategoryData = async (id: string, categoryData: CategoryType) => {
    const response = await axios.put(`${BASE_API_URL}/api/shopcategory/${id}`, categoryData);
    return response
}


export const deleteCategory = async (id: string) => {
    const response = await axios.delete(`${BASE_API_URL}/api/shopcategory/${id}`);
    return response;
}


// subCategory

export const getSubCategory = async (name: string) => {
    const response = await fetch(`${BASE_API_URL}/api/subCategory/${name}`);
    const data = response.json();
    return data;
}

// subCategoryFromName

export const getSubCategoryWithMall = async (name: string) => {
    const response = await fetch(`${BASE_API_URL}/api/subCategoryMall/${name}`);
    const data = response.json();
    return data;
}

export const getSearchShopData = async (name: string) => {
    const response = await fetch(`${BASE_API_URL}/api/search-shop/${name}`);
    const data = response.json();
    return data;
}


export const getMallByCategory = async (category: string, searchData: string) => {
    const response = await fetch(`${BASE_API_URL}/api/mall-bycategory/${category}/${searchData}`);
    const data = response.json();
    return data;
}
import { CategoryType } from "@/app/api/shopcategory/route";
import axios, { AxiosProgressEvent } from "axios"
import { BASE_API_URL } from "./constant";

export const getAllShopData = async () => {
    const { data } = await axios.get(`${BASE_API_URL}/api/shop`);
    return data;
};

export const getAllMallData = async () => {
    const { data } = await axios.get(`${BASE_API_URL}/api/mall`);
    return data;
};



export const deleteShopApi = async (id: string) => {
    const response = await axios.delete(`${BASE_API_URL}/api/shop/${id}`);
    return response;
}

export const getShopAndMallWithCategory = async (category: string) => {
    const { data } = await axios.get(`${BASE_API_URL}/api/category/${category}`);
    return data;
}

export const addShop = async (shopData: FormData, onUploadProgress: (progressEvent: AxiosProgressEvent) => void) => {
    const response = await axios.post(`${BASE_API_URL}/api/addshop`, shopData, {
        onUploadProgress
    });
    return response;
}


export const updateShop = async (id: string, shopData: FormData, onUploadProgress: (progressEvent: AxiosProgressEvent) => void) => {
    const response = await axios.put(`${BASE_API_URL}/api/shop/${id}`, shopData, {
        onUploadProgress
    });
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

export const updateMallByName = async (id: string, mallData: FormData, onUploadProgress: (progressEvent: AxiosProgressEvent) => void) => {
    const response = await axios.put(`${BASE_API_URL}/api/mall/${id}`, mallData, {
        onUploadProgress
    });
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
    try {
        const response = await axios.delete(`${BASE_API_URL}/api/shopcategory/${id}`);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || 'An error occurred');
        } else {
            throw new Error('Unexpected error occurred');
        }
    }
}
// with fetch
// export const deleteCategory = async (id: string) => {
//     try {
//       const response = await fetch(`${BASE_API_URL}/api/shopcategory/${id}`, {
//         method: 'DELETE',
//       });

//       // Check if the response is not OK (i.e., status code is not in the 200-299 range)
//       if (!response.ok) {
//         // Parse the response body if the status is not OK
//         const data = await response.json();

//         // Throw an error with the message from the backend
//         throw new Error(data.message || 'An error occurred');
//       }

//       // If the request was successful, return the response data
//       const data = await response.json();
//       return data;  // This will contain the success message
//     } catch (error) {
//       // Catch any errors and throw a more specific error message
//       if (error instanceof Error) {
//         throw new Error(error.message || 'Unexpected error occurred');
//       }
//       throw new Error('Unexpected error occurred');
//     }
//   };



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
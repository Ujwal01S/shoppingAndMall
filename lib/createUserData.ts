
export type UserDataType = {

    name: string;
    email: string;
    picture: string;
    sub?: string;
    role: string
}


export const userFormData = (formData: UserDataType) => {

    const newFormData = new FormData();
    newFormData.append("name", formData.name as string);
    newFormData.append("email", formData.email as string);
    newFormData.append("role", formData.role as string);
    newFormData.append("image", formData.picture as string);


    return newFormData;
}
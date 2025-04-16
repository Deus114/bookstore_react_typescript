import axios from "services/axios.customize"

export const loginApi = (username: string, password: string) => {
    const backendUrl = "/api/v1/auth/login";
    return axios.post<IBackendRes<ILogin>>(backendUrl, { username, password });
};

export const registerApi = (fullName: string, email: string, password: string, phone: string) => {
    const backendUrl = "/api/v1/user/register";
    return axios.post<IBackendRes<IRegister>>(backendUrl, { fullName, email, password, phone });
};

export const fetchAccountApi = () => {
    const backendUrl = "/api/v1/auth/account";
    return axios.get<IBackendRes<IFetchAccount>>(backendUrl);
};

export const logoutApi = () => {
    const backendUrl = "/api/v1/auth/logout";
    return axios.post<IBackendRes<ILogin>>(backendUrl);
};

export const getUserApi = (query: string) => {
    const backendUrl = `/api/v1/user?${query}`;
    return axios.get<IBackendRes<IModelPaginate<IUserTable>>>(backendUrl);
};

export const createUserApi = (
    fullName: string, email: string, password: string, phone: string
) => {
    const backendUrl = `/api/v1/user`;
    return axios.post<IBackendRes<IRegister>>(backendUrl,
        { fullName, email, password, phone }
    );
};

export const bulkCreateUserApi = (data: {
    fullName: string, email: string, password: string, phone: string
}[]) => {
    const backendUrl = `/api/v1/user/bulk-create`;
    return axios.post<IBackendRes<IResponseImport>>(backendUrl, data);
};

export const updateUserApi = (
    _id: string, fullName: string, phone: string
) => {
    const backendUrl = `/api/v1/user`;
    return axios.put<IBackendRes<IRegister>>(backendUrl,
        { _id, fullName, phone }
    );
};

export const deleteUserApi = (_id: string) => {
    const backendUrl = `/api/v1/user/${_id}`;
    return axios.delete<IBackendRes<IRegister>>(backendUrl,);
};

export const getBookApi = (query: string) => {
    const backendUrl = `/api/v1/book?${query}`;
    return axios.get<IBackendRes<IModelPaginate<IBookTable>>>(backendUrl);
};

export const getCategoriesApi = () => {
    const backendUrl = `/api/v1/database/category`;
    return axios.get<IBackendRes<string[]>>(backendUrl);
};

export const uploadFileApi = (fileImg: any, folder: string) => {
    const formData = new FormData();
    formData.append('fileImg', fileImg);
    return axios<IBackendRes<{ fileUploaded: string }>>({
        method: "post",
        url: "/api/v1/file/upload",
        data: formData,
        headers: {
            "Content-Type": "multipart/form-data",
            "upload-type": folder
        }
    })
}

export const createBookApi = (
    mainText: string, author: string,
    category: string, price: number, quantity: number,
    thumbnail: string, slider: string[]
) => {
    const backendUrl = `/api/v1/book`;
    return axios.post<IBackendRes<IRegister>>(backendUrl,
        { mainText, author, category, price, quantity, thumbnail, slider }
    );
};

export const updateBookApi = (
    _id: string,
    mainText: string, author: string,
    category: string, price: number, quantity: number,
    thumbnail: string, slider: string[]
) => {
    const backendUrl = `/api/v1/book/${_id}`;
    return axios.put<IBackendRes<IRegister>>(backendUrl,
        { mainText, author, category, price, quantity, thumbnail, slider }
    );
};

export const deleteBookApi = (_id: string) => {
    const backendUrl = `/api/v1/book/${_id}`;
    return axios.delete<IBackendRes<IRegister>>(backendUrl);
}

export const getBookByIdApi = (_id: string) => {
    const backendUrl = `/api/v1/book/${_id}`;
    return axios.get<IBackendRes<IBookTable>>(backendUrl);
}

export const createOrderApi = (
    name: string, address: string,
    phone: string, totalPrice: number, type: string, detail: any
) => {
    const backendUrl = `/api/v1/order`;
    return axios.post<IBackendRes<IRegister>>(backendUrl,
        { name, address, phone, totalPrice, type, detail }
    );
};

export const getHistoryApi = () => {
    const backendUrl = `/api/v1/history`;
    return axios.get<IBackendRes<IHistory[]>>(backendUrl);
};

export const updateUserInfoApi = (
    _id: string, avatar: string, fullName: string, phone: string
) => {
    const backendUrl = `/api/v1/user`;
    return axios.put<IBackendRes<IRegister>>(backendUrl,
        { _id, avatar, fullName, phone }
    );
};

export const updateUserPasswordApi = (
    email: string, oldPass: string, newPass: string
) => {
    const backendUrl = `/api/v1/user/change-password`;
    return axios.put<IBackendRes<IRegister>>(backendUrl,
        { email, oldPass, newPass }
    );
};

export const getOrdersApi = (query: string) => {
    const backendUrl = `/api/v1/order?${query}`;
    return axios.get<IBackendRes<IModelPaginate<IHistory>>>(backendUrl);
};

export const getDashboardApi = () => {
    const backendUrl = `/api/v1/database/dashboard`;
    return axios.get<IBackendRes<{
        countOrder: number,
        countUser: number,
        countBook: number
    }>>(backendUrl);
};


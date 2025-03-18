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
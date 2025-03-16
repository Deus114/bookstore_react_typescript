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
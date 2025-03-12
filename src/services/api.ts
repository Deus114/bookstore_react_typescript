import axios from "services/axios.customize"

export const loginApi = (username: string, password: string) => {
    const backendUrl = "/api/v1/auth/login";
    return axios.post<IBackendRes<ILogin>>(backendUrl, { username, password });
};

export const registerApi = (fullName: string, email: string, password: string, phone: string) => {
    const backendUrl = "/api/v1/user/register";
    return axios.post<IBackendRes<IRegister>>(backendUrl, { fullName, email, password, phone });
};
import axios, { AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';

axios.defaults.baseURL = 'http://127.0.0.1:8000/api/';

axios.interceptors.request.use(
    (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
        const authToken: string | null = localStorage.getItem('token');

        if (authToken) {
            config.headers['Authorization'] = 'Bearer ' + authToken;
        }
        
        return config;
    },
    (error: any): Promise<never> => {
        return Promise.reject(error);
    }
);

export default axios;
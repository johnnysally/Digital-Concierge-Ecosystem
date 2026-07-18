import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const axiosClient = axios.create({
    baseURL: API_URL,
    headers: { 'Content-Type': 'application/json' },
});

axiosClient.interceptors.request.use((config) => {
    const getAuthToken = () => {
        const accommodationStored = localStorage.getItem('digitalsafaris_accommodation');
        const customerStored = localStorage.getItem('digitalsafaris_customer');
        if (config.url?.includes('/accommodation') && accommodationStored) {
            return JSON.parse(accommodationStored).token;
        }
        if (config.url?.includes('/customer') && customerStored) {
            return JSON.parse(customerStored).token;
        }
        if (accommodationStored) {
            return JSON.parse(accommodationStored).token;
        }
        if (customerStored) {
            return JSON.parse(customerStored).token;
        }
        return null;
    };

    const token = getAuthToken();
    if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('digitalsafaris_customer');
            window.location.href = '/customer/login';
        }
        return Promise.reject(error);
    }
);

export const api = axiosClient;
export default axiosClient;
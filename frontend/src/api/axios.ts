import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const axiosClient = axios.create({
    baseURL: API_URL,
    headers: { 'Content-Type': 'application/json' },
});

const getStoredSession = (storageKey: string) => {
    try {
        const storedValue = localStorage.getItem(storageKey);
        if (!storedValue) return null;
        const parsedValue = JSON.parse(storedValue);
        return parsedValue && typeof parsedValue === 'object' ? parsedValue : null;
    } catch {
        return null;
    }
};

axiosClient.interceptors.request.use((config) => {
    const getAuthToken = () => {
        const accommodationSession = getStoredSession('digitalsafaris_accommodation');
        const customerSession = getStoredSession('digitalsafaris_customer');
        const transportSession = getStoredSession('digitalsafaris_transport');
        const restaurantSession = getStoredSession('digitalsafaris_restaurant');

        if (config.url?.includes('/restaurant') && restaurantSession?.token) {
            return restaurantSession.token;
        }
        if (config.url?.includes('/accommodation') && accommodationSession?.token) {
            return accommodationSession.token;
        }
        if (config.url?.includes('/customer') && customerSession?.token) {
            return customerSession.token;
        }
        if (config.url?.includes('/transport') && transportSession?.token) {
            return transportSession.token;
        }
        if (restaurantSession?.token) {
            return restaurantSession.token;
        }
        if (accommodationSession?.token) {
            return accommodationSession.token;
        }
        if (customerSession?.token) {
            return customerSession.token;
        }
        if (transportSession?.token) {
            return transportSession.token;
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
            const requestUrl = error.config?.url || '';
            const hasAuthHeader = Boolean(error.config?.headers?.Authorization);
            const isAuthRoute = requestUrl.includes('/accommodation/auth/') || requestUrl.includes('/customer/auth/') || requestUrl.includes('/transport/auth/') || requestUrl.includes('/restaurant/auth/');

            if (!hasAuthHeader || isAuthRoute) {
                return Promise.reject(error);
            }

            if (requestUrl.includes('/restaurant')) {
                localStorage.removeItem('digitalsafaris_restaurant');
                window.location.href = '/restaurant-admin/login';
            } else if (requestUrl.includes('/transport')) {
                localStorage.removeItem('digitalsafaris_transport');
                window.location.href = '/transport-admin/login';
            } else if (requestUrl.includes('/accommodation')) {
                localStorage.removeItem('digitalsafaris_accommodation');
                window.location.href = '/accommodation/login';
            } else {
                localStorage.removeItem('digitalsafaris_customer');
                window.location.href = '/customer/login';
            }
        }
        return Promise.reject(error);
    }
);

export const api = axiosClient;
export default axiosClient;
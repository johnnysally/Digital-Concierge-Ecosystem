import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || '/api/customer',
  headers: {
    Accept: 'application/json',
  },
});

export default apiClient;

import { api } from './axios';

export const getAllCustomers = async (params?: any) => {
    const res = await api.get('/admin/customers', { params });
    return res.data;
};

export const getCustomer = async (id: string) => {
    const res = await api.get(`/admin/customers/${id}`);
    return res.data;
};

export const suspendCustomer = async (id: string) => {
    const res = await api.put(`/admin/customers/${id}/suspend`);
    return res.data;
};

export const activateCustomer = async (id: string) => {
    const res = await api.put(`/admin/customers/${id}/activate`);
    return res.data;
};

export const deleteCustomer = async (id: string) => {
    const res = await api.delete(`/admin/customers/${id}`);
    return res.data;
};
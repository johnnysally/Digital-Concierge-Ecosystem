import { api } from '../axios';

export const createProperty = async (data: any) => {
    const res = await api.post('/accommodation/properties', data);
    return res.data;
};

export const uploadPropertyImages = async (files: FileList | File[]) => {
    const formData = new FormData();
    const fileList = Array.isArray(files) ? files : Array.from(files);
    fileList.forEach((file) => formData.append('images', file));

    const res = await api.post('/accommodation/properties/upload-images', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
};

export const getMyProperties = async () => {
    const res = await api.get('/accommodation/properties');
    return res.data;
};

export const getProperty = async (id: string) => {
    const res = await api.get(`/accommodation/properties/${id}`);
    return res.data;
};

export const updateProperty = async (id: string, data: any) => {
    const res = await api.put(`/accommodation/properties/${id}`, data);
    return res.data;
};

export const deleteProperty = async (id: string) => {
    const res = await api.delete(`/accommodation/properties/${id}`);
    return res.data;
};
import { api } from '../axios';

export const createRoom = async (data: any) => {
    const res = await api.post('/accommodation/rooms', data);
    return res.data;
};

export const uploadRoomImages = async (files: FileList | File[]) => {
    const formData = new FormData();
    const fileList = Array.isArray(files) ? files : Array.from(files);
    fileList.forEach((file) => formData.append('images', file));

    const res = await api.post('/accommodation/rooms/upload-images', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
};

export const getRooms = async (params?: any) => {
    const res = await api.get('/accommodation/rooms', { params });
    return res.data;
};

export const getRoom = async (id: string) => {
    const res = await api.get(`/accommodation/rooms/${id}`);
    return res.data;
};

export const updateRoom = async (id: string, data: any) => {
    const res = await api.put(`/accommodation/rooms/${id}`, data);
    return res.data;
};

export const deleteRoom = async (id: string) => {
    const res = await api.delete(`/accommodation/rooms/${id}`);
    return res.data;
};
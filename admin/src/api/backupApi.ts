import { api } from './axios';

export const listBackups = async () => {
    const res = await api.get('/admin/backups');
    return res.data;
};

export const createBackup = async () => {
    const res = await api.post('/admin/backups/create');
    return res.data;
};

export const downloadBackup = async (filename: string) => {
    const res = await api.get(`/admin/backups/download/${filename}`, { responseType: 'blob' });
    return res.data;
};

export const restoreBackup = async (filename: string) => {
    const res = await api.post(`/admin/backups/restore/${filename}`);
    return res.data;
};

export const uploadBackup = async (file: File) => {
    const formData = new FormData();
    formData.append('backup', file);
    const res = await api.post('/admin/backups/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    return res.data;
};

export const sendBackupEmail = async (filename: string, email: string) => {
    const res = await api.post(`/admin/backups/send/${filename}`, { email });
    return res.data;
};

export const deleteBackup = async (filename: string) => {
    const res = await api.delete(`/admin/backups/${filename}`);
    return res.data;
};

export const getBackupSettings = async () => {
    const res = await api.get('/admin/backups/settings');
    return res.data;
};

export const updateBackupSettings = async (data: any) => {
    const res = await api.put('/admin/backups/settings', data);
    return res.data;
};
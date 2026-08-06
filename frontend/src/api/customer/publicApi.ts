import { api } from '../axios';

export const getPublicConfig = async () => {
    const res = await api.get('/public/config');
    return res.data;
};

export const getTerms = async () => {
    const res = await api.get('/public/terms');
    return res.data;
};

export const getPrivacy = async () => {
    const res = await api.get('/public/privacy');
    return res.data;
};

export const getCookies = async () => {
    const res = await api.get('/public/cookies');
    return res.data;
};

export const getSupportInfo = async () => {
    const res = await api.get('/public/support');
    return res.data;
};

export const submitContact = async (data: { name: string; email: string; subject: string; message: string }) => {
    const res = await api.post('/public/contact', data);
    return res.data;
};
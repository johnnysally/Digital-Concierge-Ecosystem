import { api } from '../axios';

export const getDestinationPrices = async (params?: any) => {
    const res = await api.get('/transport/pricing', { params });
    return res.data;
};

export const createDestinationPrice = async (data: any) => {
    const res = await api.post('/transport/pricing', data);
    return res.data;
};

export const updateDestinationPrice = async (id: string, data: any) => {
    const res = await api.put(`/transport/pricing/${id}`, data);
    return res.data;
};

export const deleteDestinationPrice = async (id: string) => {
    const res = await api.delete(`/transport/pricing/${id}`);
    return res.data;
};

export const calculateFare = async (data: {
    from: string;
    to: string;
    vehicleType?: string;
    pickupCoords?: string;
    dropoffCoords?: string;
    manualDistance?: number;
    seats?: number;
}) => {
    const res = await api.post('/transport/pricing/calculate', data);
    return res.data;
};
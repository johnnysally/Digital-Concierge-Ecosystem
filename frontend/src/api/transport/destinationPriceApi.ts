import { api } from '../axios';

export const getDestinationPrices = async () => {
    const res = await api.get('/transport/destination-prices');
    return res.data;
};

export const createDestinationPrice = async (data: any) => {
    const res = await api.post('/transport/destination-prices', data);
    return res.data;
};

export const updateDestinationPrice = async (id: string, data: any) => {
    const res = await api.put(`/transport/destination-prices/${id}`, data);
    return res.data;
};

export const deleteDestinationPrice = async (id: string) => {
    const res = await api.delete(`/transport/destination-prices/${id}`);
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
    const res = await api.post('/public/calculate-fare', data);
    return res.data;
};
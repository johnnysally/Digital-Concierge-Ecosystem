import { api } from '../axios';

export const calculateFare = async (data: {
    from: string;
    to: string;
    vehicleType?: string;
    pickupCoords?: string;
    dropoffCoords?: string;
    manualDistance?: number;
    seats?: number;
    town?: string;
    partner?: string;
}) => {
    const res = await api.post('/public/calculate-fare', data);
    return res.data;
};
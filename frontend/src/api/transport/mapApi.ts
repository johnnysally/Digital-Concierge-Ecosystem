import { api } from '../axios';

export const getActiveVehicles = async () => {
    const res = await api.get('/transport/map/vehicles');
    return res.data;
};

export const getVehicleLocation = async (id: string) => {
    const res = await api.get(`/transport/map/vehicles/${id}`);
    return res.data;
};

export const updateVehicleLocation = async (id: string, coordinates: [number, number]) => {
    const res = await api.put(`/transport/map/vehicles/${id}/location`, { coordinates });
    return res.data;
};

export const getActiveTrips = async () => {
    const res = await api.get('/transport/map/active-trips');
    return res.data;
};

export const getTripRoute = async (id: string) => {
    const res = await api.get(`/transport/map/trips/${id}`);
    return res.data;
};
import axiosClient from "../axios";

export const getMyBookings = (params?: any) =>
	axiosClient.get("/customer/bookings", { params });

export const getBooking = (id: string) =>
	axiosClient.get(`/customer/bookings/${id}`);

export const createBooking = (booking: any) =>
	axiosClient.post("/customer/bookings", booking);

export const cancelBooking = (id: string) =>
	axiosClient.post(`/customer/bookings/${id}/cancel`);


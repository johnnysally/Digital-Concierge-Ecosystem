import axiosClient from "../axios";

export const getMyBookings = async (params?: any) => {
	const res = await axiosClient.get("/customer/bookings", { params });
	return res.data;
};

export const getBooking = async (id: string) => {
	const res = await axiosClient.get(`/customer/bookings/${id}`);
	return res.data;
};

export const createBooking = async (booking: any) => {
	const res = await axiosClient.post("/customer/bookings", booking);
	return res.data;
};

export const cancelBooking = async (id: string) => {
	const res = await axiosClient.post(`/customer/bookings/${id}/cancel`);
	return res.data;
};

// Backwards-compat: alias getBookings for existing imports
export const getBookings = getMyBookings;


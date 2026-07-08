import { apiClient } from "../axiosClient";
import { Booking } from "../../types/customer";

export async function getBookings(): Promise<Booking[]> {
	const response = await apiClient.get<{ bookings: Booking[] }>("/customer/bookings");
	return response.data.bookings;
}

export async function createBooking(booking: Booking): Promise<Booking> {
	const response = await apiClient.post<{ booking: Booking }>("/customer/bookings", booking);
	return response.data.booking;
}


import axiosClient from "../axios";

export interface LoginPayload {
	email: string;
	password: string;
}

export const login = async (payload: LoginPayload) => {
	const res = await axiosClient.post("/customer/auth/login", payload);
	return res.data;
};

export const register = async (payload: LoginPayload) => {
	const res = await axiosClient.post("/customer/auth/register", payload);
	return res.data;
};

export const refreshUser = async () => {
	const res = await axiosClient.get("/customer/auth/me");
	return res.data;
};


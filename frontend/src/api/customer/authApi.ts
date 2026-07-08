import axiosClient from "../axios";

export interface LoginPayload {
	email: string;
	password: string;
}

export const login = (payload: LoginPayload) =>
	axiosClient.post("/customer/auth/login", payload);

export const register = (payload: LoginPayload) =>
	axiosClient.post("/customer/auth/register", payload);

export const refreshUser = () =>
	axiosClient.get("/customer/auth/me");


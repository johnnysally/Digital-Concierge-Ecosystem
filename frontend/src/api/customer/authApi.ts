import { apiClient } from "../axiosClient";
import { User } from "../../types/customer";

export interface LoginPayload {
  email: string;
  password: string;
}

export async function login(payload: LoginPayload): Promise<User> {
  const response = await apiClient.post<{ user: User }>("/auth/login", payload);
  return response.data.user;
}

export async function register(payload: LoginPayload): Promise<User> {
  const response = await apiClient.post<{ user: User }>("/auth/register", payload);
  return response.data.user;
}

export async function refreshUser(): Promise<User> {
  const response = await apiClient.get<{ user: User }>("/auth/me");
  return response.data.user;
}

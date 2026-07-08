<<<<<<< HEAD
import { apiClient } from "../axiosClient";
import { Message } from "../../types/customer";

export async function getMessages(): Promise<Message[]> {
  const response = await apiClient.get<{ messages: Message[] }>("/customer/chat");
  return response.data.messages;
}

export async function sendMessage(body: string): Promise<Message> {
  const response = await apiClient.post<{ message: Message }>("/customer/chat", { body });
  return response.data.message;
}
=======
import axiosClient from '../axios';

export const sendMessage = (data: { message: string }) =>
    axiosClient.post('/customer/chat', data);

export const getChatHistory = (params?: any) =>
    axiosClient.get('/customer/chat', { params });
>>>>>>> 6b5aaf6aca0fff1fc0de1f47e6162024c378b818

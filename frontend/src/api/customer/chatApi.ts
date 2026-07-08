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

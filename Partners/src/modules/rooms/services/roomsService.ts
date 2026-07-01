import axios from 'axios';
import { Room, RoomType } from '../types';

const BASE = '/api/partners/accommodation/rooms';

export async function fetchRoomTypes(): Promise<RoomType[]> {
  const { data } = await axios.get(`${BASE}/types`);
  return data;
}

export async function fetchRooms(): Promise<Room[]> {
  const { data } = await axios.get(BASE);
  return data;
}

export async function createRoom(payload: Partial<Room>) {
  const { data } = await axios.post(BASE, payload);
  return data;
}

export async function updateRoom(id: string, payload: Partial<Room>) {
  const { data } = await axios.put(`${BASE}/${id}`, payload);
  return data;
}

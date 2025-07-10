import axios from "axios";
import { apiUrl } from "../variables";
import { Room } from "@/interfaces/movie";

export const getRooms = async () => {
  const response = await axios.get(`${apiUrl}/api/rooms/`);
  return response.data;
};

export const getRoom = async (id: string | number) => {
  const response = await axios.get(`${apiUrl}/api/rooms/${id}`);
  return response.data;
};

export const createRoom = async (room: Room) => {
  const response = await axios.post(`${apiUrl}/api/rooms/`, room);
  return response.data;
};

export const updateRoom = async (id: string | number, room: Room) => {
  const response = await axios.put(`${apiUrl}/api/rooms/${id}`, room);
  return response.data;
};

export const deleteRoom = async (id: string | number) => {
  const response = await axios.delete(`${apiUrl}/api/rooms/${id}`);
  return response.data;
}; 
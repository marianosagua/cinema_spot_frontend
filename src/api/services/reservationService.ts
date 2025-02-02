import axios from "axios";
import { apiUrl } from "../variables";
import { Reservation } from "@/interfaces/reservation";
import { Seat } from "@/interfaces";

export const addReservationDB = async (data: Reservation) => {
  const response = await axios.post(`${apiUrl}/api/reservations/`, data);
  return response.data;
};

export const updateSeat = async (id: string, data: Seat) => {
  const response = await axios.put(`${apiUrl}/api/seats/${id}/`, data);
  return response.data;
};

export const getReservationsByUser = async (user: string) => {
  const response = await axios.get(`${apiUrl}/api/reservations/user/${user}`);
  return response.data;
};

export const deleteReservationDB = async (id: string) => {
  const response = await axios.delete(`${apiUrl}/api/reservations/${id}`);
  return response.data;
};

export const getReservations = async (token: string) => {
  const response = await axios.get(`${apiUrl}/api/reservations/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

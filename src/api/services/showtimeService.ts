import axios from "axios";
import { apiUrl } from "../variables";
import { Showtime } from "@/interfaces/showtime";

export const getShowtimes = async (token: string) => {
  const response = await axios.get(`${apiUrl}/api/showtimes/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getShowtimesByMovie = async (id: string | undefined) => {
  const response = await axios.get(`${apiUrl}/api/showtimes/movie/${id}`);
  return response.data;
};

export const getShowtime = async (id: string | undefined) => {
  const response = await axios.get(`${apiUrl}/api/showtimes/${id}`);
  return response.data;
};

export const createShowtime = async (showtime: Showtime) => {
  const response = await axios.post(`${apiUrl}/api/showtimes/`, showtime);
  return response.data;
};

export const updateShowtime = async (id: string | number, showtime: Showtime) => {
  const response = await axios.put(`${apiUrl}/api/showtimes/${id}`, showtime);
  return response.data;
};

export const deleteShowtime = async (id: string | number) => {
  const response = await axios.delete(`${apiUrl}/api/showtimes/${id}`);
  return response.data;
};

export const getSeatsByRoom = async (room: string | undefined) => {
  const seats = await axios.get(`${apiUrl}/api/seats/room/${room}`);
  return seats.data;
};

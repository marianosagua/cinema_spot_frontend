import axios from "axios";
import { apiUrl } from "../variables";

export const getShowtimesByMovie = async (id: number | undefined) => {
  const response = await axios.get(`${apiUrl}/api/showtimes/movie/${id}`);
  return response.data;
};

export const getShowtime = async (id: string | undefined) => {
  const response = await axios.get(`${apiUrl}/api/showtimes/${id}`);
  return response.data;
};

export const getSeatsByShowtime = async (room: string | undefined) => {
  const dataRoom = await axios.get(`${apiUrl}/api/seats/rooms/${room}`);
  const dataSeats = await axios.get(`${apiUrl}/api/seats/${dataRoom.data.id}`);
  return dataSeats.data;
};

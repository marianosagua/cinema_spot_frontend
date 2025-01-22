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

export const getSeatsByRoom = async (room: string | undefined) => {
  const seats = await axios.get(`${apiUrl}/api/seats/room/${room}`);
  return seats.data;
};

import axios from "axios";
import { apiUrl } from "../variables";

export const getCastByMovie = async (movieId: number | string) => {
  const response = await axios.get(`${apiUrl}/api/movie-cast/movie/${movieId}`);
  console.log("response", response.data);
  return response.data;
};

export const getActors = async () => {
  const response = await axios.get(`${apiUrl}/api/actors/movie-cast`);
  return response.data;
};

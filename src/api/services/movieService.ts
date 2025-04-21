import axios from "axios";
import { apiUrl } from "../variables";

export const getMovies = async () => {
  const response = await axios.get(`${apiUrl}/api/movies/`);
  return response.data;
};

export const getMovie = async (id: string | undefined) => {
  const response = await axios.get(`${apiUrl}/api/movies/${id}`);
  return response.data;
};

export const getFutureMovies = async () => {
  const response = await axios.get(`${apiUrl}/api/future-releases/`);
  return response.data;
};

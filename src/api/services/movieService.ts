import axios from "axios";
import { apiUrl } from "../variables";
import { Movie } from "@/interfaces/movie";

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

export const createMovie = async (movie: Partial<Movie>) => {
  const response = await axios.post(`${apiUrl}/api/movies/`, movie);
  return response.data;
};

export const updateMovie = async (id: string | number, movie: Partial<Movie>) => {
  const response = await axios.put(`${apiUrl}/api/movies/${id}`, movie);
  return response.data;
};

export const deleteMovie = async (id: string | number) => {
  const response = await axios.delete(`${apiUrl}/api/movies/${id}`);
  return response.data;
};

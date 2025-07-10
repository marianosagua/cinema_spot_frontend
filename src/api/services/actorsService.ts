import axios from "axios";
import { apiUrl } from "../variables";
import { Actor } from "@/interfaces/actor";

// GET / - Listar todas las relaciones película-actor
export const getAllMovieCast = async (token: string): Promise<Actor[]> => {
  const response = await axios.get(`${apiUrl}/api/movie-cast/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// GET /movie/:movieId - Listar el reparto de una película específica
export const getCastByMovie = async (
  movieId: number | string
): Promise<Actor[]> => {
  const response = await axios.get(`${apiUrl}/api/movie-cast/movie/${movieId}`);
  return response.data;
};

// GET /:movie/:actor - Obtener la relación específica entre una película y un actor
export const getMovieCastById = async (
  movieId: number | string,
  actorId: number | string
): Promise<Actor> => {
  const response = await axios.get(
    `${apiUrl}/api/movie-cast/${movieId}/${actorId}`
  );
  return response.data;
};

// POST / - Crear una relación película-actor (admin)
export const createMovieCast = async (
  movieCast: { movie: number; actor: number },
  token: string
): Promise<Actor> => {
  const response = await axios.post(`${apiUrl}/api/movie-cast/`, movieCast, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// DELETE /:movie/:actor - Eliminar una relación película-actor (admin)
export const deleteMovieCast = async (
  movieId: number | string,
  actorId: number | string,
  token: string
): Promise<void> => {
  const response = await axios.delete(
    `${apiUrl}/api/movie-cast/${movieId}/${actorId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

// Funciones adicionales para gestión de actores (si existen estas rutas)
export const getActors = async (token: string): Promise<Actor[]> => {
  const response = await axios.get(`${apiUrl}/api/actors/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const createActor = async (
  actor: Partial<Actor>,
  token: string
): Promise<Actor> => {
  const response = await axios.post(`${apiUrl}/api/actors/`, actor, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const updateActor = async (
  id: number,
  actor: Partial<Actor>,
  token: string
): Promise<Actor> => {
  const response = await axios.put(`${apiUrl}/api/actors/${id}`, actor, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const deleteActor = async (id: number, token: string): Promise<void> => {
  const response = await axios.delete(`${apiUrl}/api/actors/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

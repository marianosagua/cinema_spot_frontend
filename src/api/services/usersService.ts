import axios from "axios";
import { apiUrl } from "../variables";

export const getUsers = async () => {
  const response = await axios.get(`${apiUrl}/api/users/`);
  return response.data;
};

export const getUserById = async (id: string) => {
  const response = await axios.get(`${apiUrl}/api/users/${id}`);
  return response.data;
};

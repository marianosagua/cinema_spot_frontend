import axios from "axios";
import { apiUrl } from "../variables";
import { Seat } from "@/interfaces";

export const updateSeat = async (id: string, data: Seat) => {
  const response = await axios.put(`${apiUrl}/api/seats/${id}/`, data);
  return response.data;
};

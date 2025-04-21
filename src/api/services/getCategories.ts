import axios from "axios";
import { apiUrl } from "../variables";

export const getCategories = async () => {
  const response = await axios.get(`${apiUrl}/api/categories/`);
  return response.data;
};

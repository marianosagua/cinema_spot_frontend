import axios from "axios";
import { apiUrl } from "../variables";
import { Category } from "@/interfaces/category";

export const getCategories = async (token?: string) => {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const response = await axios.get(`${apiUrl}/api/categories/`, { headers });
  return response.data;
};

export const createCategory = async (category: Partial<Category>, token: string) => {
  const response = await axios.post(`${apiUrl}/api/categories/`, category, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const updateCategory = async (id: number, category: Partial<Category>, token: string) => {
  const response = await axios.put(`${apiUrl}/api/categories/${id}`, category, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const deleteCategory = async (id: number, token: string) => {
  const response = await axios.delete(`${apiUrl}/api/categories/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

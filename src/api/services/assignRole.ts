import axios from "axios";
import { apiUrl } from "../variables";

export interface Role {
  id: string;
  name: string;
  description?: string;
}

export const assignRole = async (
  userId: string,
  roleId: string,
  token: string
) => {
  const response = await axios.post(
    `${apiUrl}/api/roles/assign-role`,
    {
      userId,
      newRole: roleId,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response;
};

export const getRoles = async (token: string) => {
  const response = await axios.get(`${apiUrl}/api/roles/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const createRole = async (role: Partial<Role>, token: string) => {
  const response = await axios.post(`${apiUrl}/api/roles/`, role, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const updateRole = async (id: string, role: Partial<Role>, token: string) => {
  const response = await axios.put(`${apiUrl}/api/roles/${id}`, role, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const deleteRole = async (id: string, token: string) => {
  const response = await axios.delete(`${apiUrl}/api/roles/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

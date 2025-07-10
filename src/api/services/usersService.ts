import axios from "axios";
import { apiUrl } from "../variables";
import { api } from '../variables';
import { User, UserProfile } from '@/interfaces/user';

export const getUsers = async (token: string) => {
  const response = await axios.get(`${apiUrl}/api/users/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getUserById = async (id: string, token: string) => {
  const response = await axios.get(`${apiUrl}/api/users/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const createUser = async (user: Partial<User>, token: string) => {
  const response = await axios.post(`${apiUrl}/api/users/`, user, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const updateUser = async (id: string, user: Partial<User>, token: string) => {
  const response = await axios.put(`${apiUrl}/api/users/${id}`, user, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const deleteUser = async (id: string, token: string) => {
  const response = await axios.delete(`${apiUrl}/api/users/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const usersService = {
  async getUserProfile(): Promise<UserProfile> {
    const response = await api.get('/users/profile');
    return response.data;
  },

  async updateUserProfile(data: Partial<User>): Promise<User> {
    const response = await api.put('/users/profile', data);
    return response.data;
  },

  async getAllUsers(): Promise<User[]> {
    const response = await api.get('/users');
    return response.data;
  }
};

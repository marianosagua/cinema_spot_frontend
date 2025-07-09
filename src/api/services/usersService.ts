import axios from "axios";
import { apiUrl } from "../variables";
import { api } from '../variables';
import { User, UserProfile } from '@/interfaces/user';

export const getUsers = async () => {
  const response = await axios.get(`${apiUrl}/api/users/`);
  return response.data;
};

export const getUserById = async (id: string) => {
  const response = await axios.get(`${apiUrl}/api/users/${id}`);
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


import api from './api';
import {type User, type LoginData,type RegisterData,type LoginResponse } from '../types/authtypes';

interface AuthResponse {
  success: boolean;
  message: string;
  data: User | null;
}

const authService = {
  // Login
  login: async (data: LoginData): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/users/login', data);
    return response.data;
  },

  // Register
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/users/register', data);
    return response.data;
  },

  // Get current user
  getCurrentUser: async (): Promise<AuthResponse> => {
    const response = await api.get<AuthResponse>('/users/me');
    return response.data;
  },

  // Refresh token
  // refreshToken: async (): Promise<{ access: string }> => {
  //   const refreshToken = localStorage.getItem('refresh_token');
  //   const response = await api.post('/auth/refresh', { refresh: refreshToken });
  //   return response.data;
  // },

  // Update user 
updateUser: async (data: { first_name: string; last_name: string; phone_number: string }): Promise<AuthResponse> => {
  const response = await api.put<AuthResponse>('/users/me/update', data);
  return response.data;
},

// Change password
changePassword: async (data: { old_password: string; new_password: string; confirm_password: string }): Promise<{ success: boolean; message: string }> => {
  const response = await api.put<{ success: boolean; message: string }>('/users/me/change-password', data);
  return response.data;
},

// Delete user account
deleteUser: async (): Promise<{ success: boolean; message: string }> => {
  const response = await api.delete<{ success: boolean; message: string }>('/users/me/delete');
  return response.data;
},
};

export default authService;
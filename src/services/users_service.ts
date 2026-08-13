
import api from './api';
import {type User, type LoginData,type RegisterData,type LoginResponse , type UsersResponse } from '../types/authtypes';

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

   // Get all job seekers
  getJobSeekers: async (): Promise<UsersResponse> => {
    try {
      const response = await api.get<UsersResponse>('/users/job-seekers');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching job seekers:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch job seekers');
    }
  },

   // Update user 
updateUser: async (data: { first_name: string; last_name: string; phone_number: string }): Promise<AuthResponse> => {
  const response = await api.put<AuthResponse>('/users/me/update', data);
  return response.data;
},

// Change password
changePassword: async (data: { old_password: string; new_password: string; confirm_password: string }): Promise<{ success: boolean; message: string }> => {
  const response = await api.post<{ success: boolean; message: string }>('/users/me/change-password', data);
  return response.data;
},

// Delete user account
deleteUser: async (): Promise<{ success: boolean; message: string }> => {
  const response = await api.delete<{ success: boolean; message: string }>('/users/me/delete');
  return response.data;
},

// Forgot password - request OTP
forgotPassword: async (data: { email: string }): Promise<{ success: boolean; message: string }> => {
  const response = await api.post<{ success: boolean; message: string }>('/users/forgot-password', data);
  return response.data;
},

// Verify OTP
verifyOtp: async (data: { email: string; otp: string }): Promise<{ success: boolean; message: string }> => {
  const response = await api.post<{ success: boolean; message: string }>('/users/verify-otp', data);
  return response.data;
},

// Reset password
resetPassword: async (data: { email: string; new_password: string; confirm_password: string }): Promise<{ success: boolean; message: string }> => {
  const response = await api.post<{ success: boolean; message: string }>('/users/reset-password', data);
  return response.data;
},
};

export default authService;
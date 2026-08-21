// services/api.ts
import axios from 'axios';
import authService from './users_service';

const api = axios.create({
  baseURL: 'https://smarthire-backend-67oy.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add access token to requests
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token refresh on 401
// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     // If error is 401 and we haven't tried to refresh yet
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       try {
//         const refreshToken = localStorage.getItem('refresh_token');
//         if (!refreshToken) {
//           throw new Error('No refresh token');
//         }

//         // Try to refresh the access token
//         const response = await authService.refreshToken();
//         if (response.access) {
//           localStorage.setItem('access_token', response.access);
//           // Retry the original request with new token
//           originalRequest.headers.Authorization = `Bearer ${response.access}`;
//           return api(originalRequest);
//         }
//       } catch (refreshError) {
//         // If refresh fails, logout user
//         localStorage.removeItem('access_token');
//         localStorage.removeItem('refresh_token');
//         localStorage.removeItem('user');
//         window.location.href = '/login';
//         return Promise.reject(refreshError);
//       }
//     }

//     return Promise.reject(error);
//   }
// );

export default api;
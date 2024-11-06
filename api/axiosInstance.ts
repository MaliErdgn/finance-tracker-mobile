// src/api/axiosInstance.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '@/constants/Variables';
import { getAuthToken, setAuthToken } from '@/utils/authToken';
import { getLogoutHandler } from '@/utils/authHelper';

// Create an axios instance
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token to the headers
axiosInstance.interceptors.request.use(
  async (config) => {
    const token = getAuthToken() || (await AsyncStorage.getItem('accessToken'));

    // Exclude login and register endpoints
    if (
      token &&
      config.headers &&
      !config.url?.endsWith('/login') &&
      !config.url?.endsWith('/register')
    ) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if the error is due to expired access token
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.endsWith('/refresh-token')
    ) {
      originalRequest._retry = true;
      try {
        // Attempt to get a new access token using the refresh token
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(
            `${BASE_URL}/refresh-token`,
            { refreshToken }
          );

          const { accessToken: newAccessToken } = response.data;
          await AsyncStorage.setItem('accessToken', newAccessToken);
          setAuthToken(newAccessToken); // Update the in-memory token

          // Update the original request with the new token and retry
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return axiosInstance(originalRequest);
        } else {
          // No refresh token, need to logout
          const logout = getLogoutHandler();
          if (logout) {
            logout();
          }
        }
      } catch (refreshError) {
        console.error('Error refreshing token:', refreshError);
        // Clear tokens and redirect to login if refresh fails
        await AsyncStorage.removeItem('accessToken');
        await AsyncStorage.removeItem('refreshToken');
        setAuthToken(null);
        const logout = getLogoutHandler();
        if (logout) {
          logout();
        }
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

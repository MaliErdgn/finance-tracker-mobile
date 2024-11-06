// src/api/axiosInstance.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '@/constants/Variables';
import { getAuthToken, setAuthToken } from '@/utils/authToken';
import { AuthContext } from '@/context/AuthContext';
import { useRouter } from 'expo-router';

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
    if (token && config.headers) {
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
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        // Attempt to get a new access token using the refresh token
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(
            `${BASE_URL}/finance-tracker/api/refresh-token`,
            { refreshToken }
          );

          const { accessToken: newAccessToken } = response.data;
          await AsyncStorage.setItem('accessToken', newAccessToken);
          setAuthToken(newAccessToken); // Update the in-memory token

          // Update the original request with the new token and retry
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        console.error('Error refreshing token:', refreshError);
        // Clear tokens and redirect to login if refresh fails
        await AsyncStorage.removeItem('accessToken');
        await AsyncStorage.removeItem('refreshToken');
        setAuthToken(null);
        // Optionally, navigate to login page
        const router = useRouter();
        router.replace('/auth/login');
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

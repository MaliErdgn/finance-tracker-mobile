// src/context/AuthContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import axiosInstance from '@/api/axiosInstance';
const jwt_decode = require('jwt-decode');
import { setAuthToken } from '@/utils/authToken';
import { setLogoutHandler } from '@/utils/authHelper';

interface AuthContextProps {
  isAuthenticated: boolean;
  login: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
  setIsAuthenticated: (value: boolean) => void;
  isLoading: boolean;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextProps>({
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
  setIsAuthenticated: () => {},
  isLoading: true,
});

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  // Function to decode and check if token is expired
  const checkIfTokenExpired = (token: string) => {
    const decodedToken: any = jwt_decode(token);
    const currentTime = Date.now() / 1000;
    return decodedToken.exp < currentTime;
  };

  // Function to log in the user and save tokens
  const login = async (accessToken: string, refreshToken: string) => {
    await AsyncStorage.setItem('accessToken', accessToken);
    await AsyncStorage.setItem('refreshToken', refreshToken);
    setAuthToken(accessToken);
    setIsAuthenticated(true);
    router.replace('/(tabs)/dashboard');
  };

  // Function to log out the user
  const logout = async () => {
    await AsyncStorage.removeItem('accessToken');
    await AsyncStorage.removeItem('refreshToken');
    setAuthToken(null);
    setIsAuthenticated(false);
    router.replace('/auth/login');
  };

  // Set the logout handler globally
  useEffect(() => {
    setLogoutHandler(logout);
  }, []);

  // Check tokens and refresh if necessary on app launch
  useEffect(() => {
    const checkTokenOnLaunch = async () => {
      const accessToken = await AsyncStorage.getItem('accessToken');
      const refreshToken = await AsyncStorage.getItem('refreshToken');

      if (accessToken) {
        setAuthToken(accessToken);
        setIsAuthenticated(true);

        const isTokenExpired = checkIfTokenExpired(accessToken);
        if (isTokenExpired && refreshToken) {
          try {
            const response = await axiosInstance.post('/refresh-token', { refreshToken });
            const { accessToken: newAccessToken } = response.data;
            await AsyncStorage.setItem('accessToken', newAccessToken);
            setAuthToken(newAccessToken);
          } catch (error) {
            console.error('Error refreshing token:', error);
            logout();
          }
        }
      } else {
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    };

    checkTokenOnLaunch();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        login,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// src/context/AuthContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import axiosInstance from '@/api/axiosInstance';
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

// Define the decodeToken function
const decodeToken = (token: string): any | null => {
  try {
    const parts = token.split('.'); // Split the token by dots

    // Check if the token has three parts (header, payload, signature)
    if (parts.length !== 3) {
      console.error("Invalid token structure");
      return null;
    }

    const base64Url = parts[1]; // Extract payload part
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null; // Return null if decoding fails
  }
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  // Function to decode and check if token is expired
  const isTokenExpired = (token: string | null) => {
    // If the token is null or empty, treat it as expired
    if (!token) return true;

    const decodedToken = decodeToken(token);

    if (!decodedToken) {
      console.error("Invalid token, unable to decode");
      return true;
    }

    const currentTime = Date.now() / 1000;
    return decodedToken.exp < currentTime;
  };

  // Function to log in the user and save tokens
  const login = async (accessToken: string, refreshToken: string) => {
    if (!accessToken || !refreshToken) {
      console.error("Missing access or refresh token");
      return;
    }
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

        // Check if the access token is valid and not expired
        const tokenExpired = isTokenExpired(accessToken);
        if (tokenExpired && refreshToken) {
          try {
            const response = await axiosInstance.post('/refresh-token', { refreshToken });
            const { accessToken: newAccessToken } = response.data;
            if (newAccessToken) {
              await AsyncStorage.setItem('accessToken', newAccessToken);
              setAuthToken(newAccessToken);
            } else {
              console.error("No access token returned from refresh request");
              logout();
            }
          } catch (error) {
            console.error('Error refreshing token:', error);
            logout(); // Log out if refreshing token fails
          }
        }
      } else {
        console.warn("No access token found on app launch");
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

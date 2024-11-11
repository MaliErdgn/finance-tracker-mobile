// src/context/AuthContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useSegments } from 'expo-router';
import axiosInstance from '@/api/axiosInstance';

interface AuthContextProps {
  isAuthenticated: boolean;
  login: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
  isLoading: boolean;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextProps>({
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
  isLoading: true,
});

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [initialCheckDone, setInitialCheckDone] = useState<boolean>(false); // Flag to check initial auth
  const router = useRouter();
  const segments = useSegments(); // Use this to ensure the router is ready

  // Function to log in the user and save tokens
  const login = async (accessToken: string, refreshToken: string) => {
    await AsyncStorage.setItem('accessToken', accessToken);
    await AsyncStorage.setItem('refreshToken', refreshToken);
    setIsAuthenticated(true);
    router.replace('/(tabs)/dashboard');
  };

  // Function to log out the user
  const logout = async () => {
    await AsyncStorage.removeItem('accessToken');
    await AsyncStorage.removeItem('refreshToken');
    setIsAuthenticated(false);
    router.replace('/auth/login');
  };

  // Initial check if tokens exist on app launch to set authentication state
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const accessToken = await AsyncStorage.getItem('accessToken');
        const refreshToken = await AsyncStorage.getItem('refreshToken');

        if (segments.length > 0) { // Ensure the router is ready
          if (accessToken && refreshToken) {
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
            setIsAuthenticated(true);
            router.replace('/(tabs)/dashboard');
          } else {
            setIsAuthenticated(false);
            router.replace('/auth/login');
          }
        }
      } catch (error) {
        console.error("Error initializing authentication:", error);
      } finally {
        setIsLoading(false);
        setInitialCheckDone(true); // Flag to prevent repeated check
      }
    };

    if (!initialCheckDone) { // Only run the check once
      checkAuthStatus();
    }
  }, [segments, initialCheckDone]); // Depend on segments to check when router is ready

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

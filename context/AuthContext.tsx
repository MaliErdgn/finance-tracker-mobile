// src/context/AuthContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

// Define the shape of the AuthContext
interface AuthContextProps {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
  setIsAuthenticated: (value: boolean) => void;
}

// Define props for the AuthProvider component
interface AuthProviderProps {
  children: ReactNode;
}

// Create the AuthContext
export const AuthContext = createContext<AuthContextProps>({
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
  setIsAuthenticated: () => {},
});

// AuthProvider component to wrap around the app
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const router = useRouter();

  // Check authentication status on component mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem('token');
      setIsAuthenticated(!!token);
    };
    checkAuth();
  }, []);

  // Function to log in the user
  const login = async (token: string) => {
    await AsyncStorage.setItem('token', token); // Save token in AsyncStorage
    setIsAuthenticated(true);
    router.replace('/(tabs)/dashboard'); // Navigate to Dashboard after login
  };

  // Function to log out the user
  const logout = async () => {
    await AsyncStorage.removeItem('token'); // Remove token from AsyncStorage
    setIsAuthenticated(false);
    router.replace('/auth/login'); // Navigate to Login after logout
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

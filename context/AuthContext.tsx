import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from 'expo-router';

interface AuthContextProps {
    isAuthenticated: boolean;
    login: (token: string) => void;
    logout: () => void;
    setIsAuthenticated: (value: boolean) => void;
}

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthContext = createContext<AuthContextProps>({
    isAuthenticated: false,
    login: () => { },
    logout: () => { },
    setIsAuthenticated: () => { },
});

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            const token = await AsyncStorage.getItem("token");
            setIsAuthenticated(!!token);
        };
        checkAuth();
    }, []);

    const login = async (token: string) => {
        await AsyncStorage.setItem("token", token);
        setIsAuthenticated(true);
        router.replace("/(tabs)/dashboard"); // Navigate to Dashboard after login
    };

    const logout = async () => {
        await AsyncStorage.removeItem("token");
        setIsAuthenticated(false);
        router.replace("/auth/login"); // Navigate to Login after logout
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

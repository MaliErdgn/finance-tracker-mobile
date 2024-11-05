// src/app/auth/_layout.tsx

import React from "react";
import { Stack } from "expo-router";
import { Colors } from "@/constants/Colors";

const AuthLayout = () => {
    return (
        <Stack
            screenOptions={{
                headerStyle: { backgroundColor: Colors.dark.background },
                headerTintColor: Colors.dark.text,
                headerTitleStyle: { fontWeight: 'bold' },
            }}
        >
            <Stack.Screen name="login" options={{ title: 'Login' }} />
            <Stack.Screen name="register" options={{ title: 'Register' }} />
        </Stack>
    );
};

export default AuthLayout;

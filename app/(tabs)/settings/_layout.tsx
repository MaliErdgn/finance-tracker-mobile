// src/app/settings/_layout.tsx

import React from "react";
import { Stack } from "expo-router";
import { Colors } from '@/constants/Colors';

const SettingsLayout = () => {
    return (
        <Stack
            screenOptions={{
                headerStyle: {
                    backgroundColor: 'transparent', // Removes the purple background
                },
                headerTintColor: Colors.dark.text,
                headerTitleStyle: { fontWeight: 'bold' },
            }}
        >
            <Stack.Screen name="index" options={{ title: 'Settings' }} />
            {/* Define additional screens here as needed */}
            <Stack.Screen name="userInfo" options={{ title: 'User Info' }} />
            <Stack.Screen name="languages" options={{ title: 'Languages' }} />
            <Stack.Screen name="accessibility" options={{ title: 'Accessibility' }} />
            <Stack.Screen name="manageInformation" options={{ title: 'Manage Information' }} />
            <Stack.Screen name="notificationsscreen" options={{ title: 'NotificationsScreen' }} />
            <Stack.Screen name="contact" options={{ title: 'Contact' }} />
            <Stack.Screen name="helpSupport" options={{ title: 'Help & Support' }} />
            <Stack.Screen name="aboutMe" options={{ title: 'About Me' }} />
            <Stack.Screen name="checkoutApps" options={{ title: 'Checkout My Other Apps' }} />
        </Stack>
    );
};

export default SettingsLayout;

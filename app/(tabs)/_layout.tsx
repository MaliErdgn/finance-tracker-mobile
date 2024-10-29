// src/app/(tabs)/_layout.tsx

import React from "react";
import { Tabs } from "expo-router";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { TABS_CONFIGURATION } from "@/constants/Variables";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarItemStyle: { margin: 3 },
        tabBarStyle: {
          backgroundColor: Colors[colorScheme ?? "light"].background,
        },
      }}
    >
      {TABS_CONFIGURATION.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.options.title,
            tabBarIcon: ({ color, focused }) => (
              <MaterialCommunityIcons
                name={
                  focused
                    ? (tab.options.focused as keyof typeof MaterialCommunityIcons.glyphMap)
                    : (tab.options.unfocused as keyof typeof MaterialCommunityIcons.glyphMap)
                }
                size={tab.options.size}
                color={color}
              />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}

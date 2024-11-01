// src/constants/Colors.ts

const backgroundDark = '#121212'; // Dominant color
const surfaceDark = '#1E1E1E'; // Secondary color
const accentDark = '#BB86FC'; // Accent color
const textDark = '#EEEEEE'; // Light gray for text
const textSecondaryDark = '#888888'; // Gray for secondary text
const incomeDark = "#03dac6";

const backgroundLight = '#FFFFFF'; // Dominant light color
const surfaceLight = '#F5F5F5'; // Secondary light color
const accentLight = '#6200EE'; // Bright accent color
const textLight = '#212121'; // Dark gray for text
const textSecondaryLight = '#757575'; // Lighter gray for secondary text
const incomeLight = "#4CAF50"; // Green for income

export const Colors = {
  light: {
    text: textLight,
    textSecondary: textSecondaryLight,
    background: backgroundLight, // Dominant light color
    surfaceItems: surfaceLight, // Secondary light color
    accent: accentLight, // Accent color
    primary: accentLight, // Use bright accent color for primary
    errors: '#B00020', // Error color
    tint: '#6200EE', // Tint color matching the accent
    icon: '#212121', // Dark icons for visibility
    tabIconDefault: '#757575',
    tabIconSelected: '#6200EE',
    income: incomeLight,
  },
  dark: {
    text: textDark,
    textSecondary: textSecondaryDark,
    background: backgroundDark, // Dominant color
    surfaceItems: surfaceDark, // Secondary color
    accent: accentDark, // Accent color
    primary: surfaceDark, // Use secondary color for primary to avoid overuse of accent color
    errors: '#CF6679', // Error color
    tint: '#FFFFFF', // Tint color
    icon: '#FFFFFF', // White icons for visibility
    tabIconDefault: '#888888',
    tabIconSelected: '#FFFFFF',
    income: incomeDark,
  },
};

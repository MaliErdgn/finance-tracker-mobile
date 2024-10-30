// src/constants/Colors.ts

const backgroundDark = '#121212'; // Dominant color
const surfaceDark = '#1E1E1E'; // Secondary color
const accentDark = '#BB86FC'; // Accent color
const textDark = '#EEEEEE'; // Light gray for text
const textSecondaryDark = '#888888'; // Gray for secondary text
const incomeDark = "#03dac6";

export const Colors = {
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

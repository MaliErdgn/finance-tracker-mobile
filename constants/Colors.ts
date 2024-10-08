/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';



const primaryDark = '#bb86fc'
const secondaryDark = '#03dac6'
const tertiaryDark = '#cf6679'
const backgroundDark = '#121212'
const surfaceItems = '#1e1e1e'



export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    tertiary: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#eee',
    background: backgroundDark,
    surfaceItems: surfaceItems,
    primary: primaryDark,
    secondary: secondaryDark,
    tertiary: tertiaryDark,
    // 
    // 
    errors: tertiaryDark,
    tint: tintColorDark,
    icon: secondaryDark,
    tabIconDefault: secondaryDark,
    tabIconSelected: tintColorDark,
  },
};

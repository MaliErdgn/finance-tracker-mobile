import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { CategoryDataContext, ExpenseDataContext, MethodDataContext, TagDataContext, TypeDataContext } from '@/constants/Context';
import { DataType, Tag, Method, Type, Category } from '@/constants/Types';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {

  const [data, setData] = useState<DataType[] | null>(null);
  const [tags, setTags] = useState<Tag[] | null>(null);
  const [methods, setMethods] = useState<Method[] | null>(null);
  const [types, setTypes] = useState<Type[] | null>(null);
  const [category, setCategory] = useState<Category[] | null>(null);

  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    // SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    // RobotoRegular: require('../assets/fonts/Roboto-Regular.ttf'),
    // RobotoBoldItalic: require('../assets/fonts/Roboto-BoldItalic.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <ExpenseDataContext.Provider value={{ data, setData }}>
        <TagDataContext.Provider value={{ tags, setTags }}>
          <TypeDataContext.Provider value={{ types, setTypes }}>
            <MethodDataContext.Provider value={{ methods, setMethods }}>
              <CategoryDataContext.Provider value={{ category, setCategory }}>
                <Stack>
                  <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                  <Stack.Screen name="+not-found" />
                </Stack>
              </CategoryDataContext.Provider>
            </MethodDataContext.Provider>
          </TypeDataContext.Provider>
        </TagDataContext.Provider>
      </ExpenseDataContext.Provider>
    </ThemeProvider>
  );
}

// src/utils/storageUtils.js
import AsyncStorage from "@react-native-async-storage/async-storage";

export const storeTokens = async (accessToken, refreshToken) => {
  try {
    await AsyncStorage.setItem("accessToken", accessToken);
    await AsyncStorage.setItem("refreshToken", refreshToken);
  } catch (error) {
    console.error("Error storing tokens", error);
  }
};

export const getToken = async (key) => {
  try {
    return await AsyncStorage.getItem(key);
  } catch (error) {
    console.error("Error getting token", error);
  }
};

export const clearTokens = async () => {
  try {
    await AsyncStorage.removeItem("accessToken");
    await AsyncStorage.removeItem("refreshToken");
  } catch (error) {
    console.error("Error clearing tokens", error);
  }
};

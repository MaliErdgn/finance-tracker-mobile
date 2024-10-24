import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/Colors';
import { Input, Text } from '@rneui/base';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import axiosInstance from '../../api/axiosInstance';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '@/constants/Types';

type SettingsScreenNavigationProp = NavigationProp<RootStackParamList, 'settings'>;

const Settings = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation<SettingsScreenNavigationProp>();

  const handleLogin = async () => {
    console.log('handleLogin called');
    try {
      const response = await axiosInstance.post('/login', {
        username,
        password,
      });
      const { token } = response.data;
      console.log('Token received:', token);
      await AsyncStorage.setItem('token', token);
      Alert.alert('Login Successful', 'You are now logged in.');
      navigation.navigate('dashboard');
    } catch (error) {
      console.error('Error in handleLogin:', error);
      Alert.alert('Login Failed', 'An error occurred during login.');
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    Alert.alert('Logged Out', 'You have been logged out.');
    // Optionally navigate to the login screen
    navigation.navigate('settings');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerTextStyle}>
        <Text
          style={{
            color: Colors.dark.text,
            fontSize: 24,
            fontWeight: 'bold',
          }}
        >
          Settings
        </Text>
      </View>
      <View style={styles.view}>
        <Input
          label="Username"
          inputMode="text"
          keyboardType="default"
          value={username}
          onChangeText={setUsername}
          placeholder="Enter your username"
          placeholderTextColor={Colors.dark.text}
          inputStyle={styles.input}
          leftIcon={
            <MaterialCommunityIcons
              name="account"
              size={24}
              color={Colors.dark.text}
            />
          }
          containerStyle={{ paddingHorizontal: 0 }}
          inputContainerStyle={{
            paddingHorizontal: 0,
            borderColor: Colors.dark.primary,
          }}
        />
        <Input
          label="Password"
          inputMode="text"
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your password"
          placeholderTextColor={Colors.dark.text}
          inputStyle={styles.input}
          leftIcon={
            <MaterialCommunityIcons
              name="lock"
              size={24}
              color={Colors.dark.text}
            />
          }
          containerStyle={{ paddingHorizontal: 0 }}
          inputContainerStyle={{
            paddingHorizontal: 0,
            borderColor: Colors.dark.primary,
          }}
        />
        <TouchableOpacity style={styles.submitButton} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.submitButton} onPress={handleLogout}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
    paddingHorizontal: 20,
  },
  headerTextStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    marginTop: 20,
  },
  view: {
    flex: 1,
    marginTop: 20,
  },
  input: {
    fontSize: 16,
    color: Colors.dark.text,
    padding: 0,
  },
  submitButton: {
    backgroundColor: Colors.dark.surfaceItems,
    borderWidth: 1,
    borderColor: Colors.dark.primary,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    fontSize: 18,
    color: Colors.dark.text,
  },
});

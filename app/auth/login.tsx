// src/screens/auth/Login.tsx
import React, { useState, useContext } from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/Colors';
import { Input, Text } from '@rneui/base';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import axiosInstance from '@/api/axiosInstance';
import { Href, useRouter } from 'expo-router';
import { AuthContext } from '@/context/AuthContext';
import { usePopup } from '@/context/PopupContext';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { login } = useContext(AuthContext);
    const { showPopup } = usePopup();

    const handleLogin = async () => {
        if (!username || !password) {
            showPopup('Please enter both username and password.');
            return;
        }

        setLoading(true);
        try {
            // Attempt to log in
            const response = await axiosInstance.post('/login', {
                username,
                password,
            });

            const { accessToken, refreshToken } = response.data;
            if (accessToken && refreshToken) {
                await login(accessToken, refreshToken);
                showPopup('You are now logged in.');
            } else {
                showPopup('Login failed. No tokens received.');
                console.error('No tokens received:', response.data);
            }
        } catch (error: any) {
            console.error('Error in handleLogin:', error);
            if (error.response && error.response.status === 401) {
                showPopup('Invalid credentials. Please try again.');
            } else {
                showPopup('An error occurred during login. Please try again later.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerTextStyle}>
                <Text style={styles.headerText}>Login</Text>
            </View>
            <View style={styles.inputContainer}>
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
                        borderColor: Colors.dark.accent,
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
                        borderColor: Colors.dark.accent,
                    }}
                />
                <TouchableOpacity
                    style={styles.submitButton}
                    onPress={handleLogin}
                    disabled={loading}
                >
                    <Text style={styles.buttonText}>
                        {loading ? 'Logging in...' : 'Login'}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.replace('/auth/register' as Href)}>
                    <Text style={styles.linkText}>Don't have an account? Create one</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default Login;

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
        marginTop: 40,
        marginBottom: 20,
    },
    headerText: {
        color: Colors.dark.text,
        fontSize: 32,
        fontWeight: 'bold',
    },
    inputContainer: {
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
        borderColor: Colors.dark.accent,
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30,
    },
    buttonText: {
        fontSize: 18,
        color: Colors.dark.text,
    },
    linkText: {
        color: Colors.dark.accent,
        marginTop: 20,
        textAlign: 'center',
        textDecorationLine: 'underline',
    },
});

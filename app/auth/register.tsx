import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/Colors';
import { Input, Text } from '@rneui/base';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import axiosInstance from '../../api/axiosInstance';
import { useRouter } from 'expo-router';
import { usePopup } from '@/context/PopupContext'; // Use the custom hook

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { showPopup } = usePopup(); // Use the custom hook to access showPopup

    const handleRegister = async () => {
        if (!username || !password) {
            showPopup('Please enter both username and password.');
            return;
        }

        setLoading(true); // Show loading indicator
        try {
            // Attempt to register
            const response = await axiosInstance.post('/register', {
                username,
                password,
            });

            showPopup('Account created successfully. Please log in.');

            // Navigate to the Login page after successful registration
            router.replace('/auth/login');
        } catch (error: any) {
            console.error('Error in handleRegister:', error);
            if (error.response && error.response.status === 400) {
                showPopup('Username already exists.');
            } else {
                showPopup('An error occurred during registration. Please try again.');
            }
        } finally {
            setLoading(false); // Hide loading indicator
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerTextStyle}>
                <Text style={styles.headerText}>Register</Text>
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
                    onPress={handleRegister}
                    disabled={loading}
                >
                    <Text style={styles.buttonText}>
                        {loading ? 'Creating Account...' : 'Register'}
                    </Text>
                </TouchableOpacity>

                {/* Navigate to Login */}
                <TouchableOpacity onPress={() => router.replace('/auth/login')}>
                    <Text style={styles.linkText}>Already have an account? Log in</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default Register;

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

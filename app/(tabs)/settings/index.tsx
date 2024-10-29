// src/app/settings/index.tsx

import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    ScrollView,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/Colors';
import { Text } from '@rneui/base';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import MenuItem from '@/components/MenuItem';
import ConfirmationModal from '@/components/ConfirmationModal';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingsMain = () => {
    const router = useRouter();
    const [isLogoutModalVisible, setLogoutModalVisible] = useState<boolean>(false);

    // Handler to navigate to different screens
    const navigateTo = (screen: string) => {
        router.push(`/settings/${screen}`);
    };

    // Logout handlers
    const handleLogoutPress = () => {
        setLogoutModalVisible(true);
    };

    const handleLogoutConfirm = () => {
        setLogoutModalVisible(false);
        handleLogout();
    };

    const handleLogoutCancel = () => {
        setLogoutModalVisible(false);
    };

    // Logout function
    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem('token');
            Alert.alert('Logged Out', 'You have been logged out.');
            router.replace('/auth/login');
        } catch (error) {
            console.error('Error logging out:', error);
            Alert.alert('Error', 'An error occurred during logout.');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {/* Account Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Account</Text>
                    <MenuItem
                        iconName="account"
                        title="User Info / Personal Info"
                        onPress={() => navigateTo('userInfo')}
                    />
                    <MenuItem
                        iconName="translate"
                        title="Languages"
                        onPress={() => navigateTo('languages')}
                    />
                    <MenuItem
                        iconName="access-point" // Ensure this is a valid icon name
                        title="Accessibility"
                        onPress={() => navigateTo('accessibility')}
                    />
                </View>

                {/* Privacy and Security Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Privacy and Security</Text>
                    <MenuItem
                        iconName="shield-lock"
                        title="Manage Information"
                        onPress={() => navigateTo('manageInformation')}
                    />
                    <MenuItem
                        iconName="bell"
                        title="Notifications"
                        onPress={() => navigateTo('notifications')}
                    />
                </View>

                {/* About Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>About</Text>
                    <MenuItem
                        iconName="email"
                        title="Contact"
                        onPress={() => navigateTo('contact')}
                    />
                    <MenuItem
                        iconName="help-circle"
                        title="Help & Support"
                        onPress={() => navigateTo('helpSupport')}
                    />
                    <MenuItem
                        iconName="information"
                        title="About Me"
                        onPress={() => navigateTo('aboutMe')}
                    />
                </View>

                {/* Checkout Other Apps */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Others</Text>
                    <MenuItem
                        iconName="apps"
                        title="Checkout My Other Apps"
                        onPress={() => navigateTo('checkoutApps')}
                    />
                </View>

                {/* Logout Button */}
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogoutPress}>
                    <MaterialCommunityIcons name="logout" size={24} color="#fff" />
                    <Text style={styles.logoutButtonText}>Logout</Text>
                </TouchableOpacity>
            </ScrollView>

            {/* Confirmation Modal */}
            <ConfirmationModal
                visible={isLogoutModalVisible}
                message="Are you sure you want to logout?"
                onConfirm={handleLogoutConfirm}
                onCancel={handleLogoutCancel}
            />
        </SafeAreaView>
    );
};

export default SettingsMain;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.dark.background,
    },
    scrollContainer: {
        padding: 20,
    },
    section: {
        marginBottom: 30,
    },
    sectionTitle: {
        color: Colors.dark.text,
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.dark.errors,
        padding: 15,
        borderRadius: 8,
        justifyContent: 'center',
        marginTop: 20,
    },
    logoutButtonText: {
        color: '#fff',
        fontSize: 16,
        marginLeft: 10,
        fontWeight: 'bold',
    },
});

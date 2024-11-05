import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/Colors';
import { Text } from '@rneui/base';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Href, useRouter } from 'expo-router';
import MenuItem from '@/components/MenuItem';
import ConfirmationModal from '@/components/ConfirmationModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { usePopup } from '@/context/PopupContext'; // Use the custom hook
import axiosInstance from '@/api/axiosInstance';
import { DELETE_USER_API_ADDRESS } from '@/constants/Variables';

const SettingsMain = () => {
    const router = useRouter();
    const [isLogoutModalVisible, setLogoutModalVisible] = useState<boolean>(false);
    const [isDeleteAccountModalVisible, setDeleteAccountModalVisible] = useState<boolean>(false);
    const { showPopup } = usePopup(); // Use the custom hook to access showPopup

    // Handler to navigate to different screens
    const navigateTo = (screen: string) => {
        router.push(`/settings/${screen}` as Href);
    };

    // Logout handlers
    const handleLogoutPress = () => {
        setLogoutModalVisible(true);
    };

    const handleLogoutConfirm = async () => {
        setLogoutModalVisible(false);
        try {
            await AsyncStorage.removeItem('token');
            showPopup('You have been logged out.');
            router.replace('/auth/login');
        } catch (error) {
            console.error('Error logging out:', error);
            showPopup('An error occurred during logout.');
        }
    };

    const handleLogoutCancel = () => {
        setLogoutModalVisible(false);
    };

    // Delete Account handlers
    const handleDeleteAccountPress = () => {
        setDeleteAccountModalVisible(true);
    };

    const handleDeleteAccountConfirm = async () => {
        setDeleteAccountModalVisible(false);
        try {
            // Call your API to delete the account here
            // Ensure you reach your endpoint
            const response = await axiosInstance.put(DELETE_USER_API_ADDRESS);

            if (response.status === 200) {
                await AsyncStorage.removeItem('token'); // Clear the token
                showPopup('Your account has been deleted.'); // Show success message
                router.replace('/auth/login'); // Navigate to login page
            }
        } catch (error) {
            console.error('Error deleting account:', error);
            showPopup('An error occurred while deleting the account.'); // Show error message
        }
    };

    const handleDeleteAccountCancel = () => {
        setDeleteAccountModalVisible(false);
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
                        iconName="access-point"
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
                        title="NotificationsScreen"
                        onPress={() => navigateTo('notificationsscreen')}
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

                {/* Delete Account Button */}
                <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAccountPress}>
                    <MaterialCommunityIcons name="delete" size={24} color="#fff" />
                    <Text style={styles.deleteButtonText}>Delete Account</Text>
                </TouchableOpacity>
            </ScrollView>

            {/* Logout Confirmation Modal */}
            <ConfirmationModal
                visible={isLogoutModalVisible}
                message="Are you sure you want to logout?"
                onConfirm={handleLogoutConfirm}
                onCancel={handleLogoutCancel}
            />

            {/* Delete Account Confirmation Modal */}
            <ConfirmationModal
                visible={isDeleteAccountModalVisible}
                message="Are you sure you want to delete your account? This action cannot be undone."
                onConfirm={handleDeleteAccountConfirm}
                onCancel={handleDeleteAccountCancel}
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
    deleteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.dark.danger, // Use a danger color for delete
        padding: 15,
        borderRadius: 8,
        justifyContent: 'center',
        marginTop: 10,
    },
    deleteButtonText: {
        color: '#fff',
        fontSize: 16,
        marginLeft: 10,
        fontWeight: 'bold',
    },
});

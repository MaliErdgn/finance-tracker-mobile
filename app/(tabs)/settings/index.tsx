// src/screens/settings/SettingsMain.tsx
import React, { useState, useContext } from 'react';
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
import { useRouter } from 'expo-router';
import MenuItem from '@/components/MenuItem';
import ConfirmationModal from '@/components/ConfirmationModal';
import { AuthContext } from "@/context/AuthContext"; // Import AuthContext
import { usePopup } from '@/context/PopupContext'; // Use the custom hook
import axiosInstance from '@/api/axiosInstance';
import { DELETE_USER_API_ADDRESS } from '@/constants/Variables';

const SettingsMain = () => {
    const router = useRouter();
    const [isLogoutModalVisible, setLogoutModalVisible] = useState(false);
    const [isDeleteAccountModalVisible, setDeleteAccountModalVisible] = useState(false);
    const { logout } = useContext(AuthContext); // Access logout function
    const { showPopup } = usePopup(); // Use the custom hook

    // Logout handlers
    const handleLogoutPress = () => {
        setLogoutModalVisible(true);
    };

    const handleLogoutConfirm = () => {
        setLogoutModalVisible(false);
        logout(); // Call logout from AuthContext
        showPopup('You have been logged out.');
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
            // API call to delete the account
            const response = await axiosInstance.put(DELETE_USER_API_ADDRESS);
            if (response.status === 200) {
                logout(); // Call logout from AuthContext
                showPopup('Your account has been deleted.');
            }
        } catch (error) {
            console.error('Error deleting account:', error);
            showPopup('An error occurred while deleting the account.');
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
                        onPress={() => router.push('/settings/userInfo')}
                    />
                    <MenuItem
                        iconName="translate"
                        title="Languages"
                        onPress={() => router.push('/settings/languages')}
                    />
                    <MenuItem
                        iconName="access-point"
                        title="Accessibility"
                        onPress={() => router.push('/settings/accessibility')}
                    />
                </View>

                {/* Privacy and Security Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Privacy and Security</Text>
                    <MenuItem
                        iconName="shield-lock"
                        title="Manage Information"
                        onPress={() => router.push('/settings/manageInformation')}
                    />
                    <MenuItem
                        iconName="bell"
                        title="Notifications"
                        onPress={() => router.push('/settings/notificationsscreen')}
                    />
                </View>

                {/* About Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>About</Text>
                    <MenuItem
                        iconName="email"
                        title="Contact"
                        onPress={() => router.push('/settings/contact')}
                    />
                    <MenuItem
                        iconName="help-circle"
                        title="Help & Support"
                        onPress={() => router.push('/settings/helpSupport')}
                    />
                    <MenuItem
                        iconName="information"
                        title="About Me"
                        onPress={() => router.push('/settings/aboutMe')}
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
            </ScrollView>
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
        color: Colors.dark.text,
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
        color: Colors.dark.text,
        fontSize: 16,
        marginLeft: 10,
        fontWeight: 'bold',
    },
});

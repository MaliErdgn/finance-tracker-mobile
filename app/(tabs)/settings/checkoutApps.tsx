// src/screens/CheckoutApps.tsx

import React from 'react';
import { StyleSheet, Text, View, Linking, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/Colors';

const CheckoutApps = () => {
    const handleLinkPress = () => {
        Linking.openURL('https://your-other-apps-link.com'); // Replace with your actual link
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.text}>Checkout My Other Apps</Text>
            <TouchableOpacity style={styles.linkButton} onPress={handleLinkPress}>
                <Text style={styles.linkText}>Visit Website</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default CheckoutApps;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.dark.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        color: Colors.dark.text,
        fontSize: 20,
        marginBottom: 20,
    },
    linkButton: {
        backgroundColor: Colors.dark.primary,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    linkText: {
        color: Colors.dark.text,
        fontSize: 16,
        fontWeight: 'bold',
    },
});

// src/screens/ManageInformation.tsx

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/Colors';

const ManageInformation = () => {
    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.text}>Manage Information</Text>
        </SafeAreaView>
    );
};

export default ManageInformation;

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
    },
});

// src/screens/HelpSupport.tsx

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/Colors';

const HelpSupport = () => {
    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.text}>Help & Support</Text>
        </SafeAreaView>
    );
};

export default HelpSupport;

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

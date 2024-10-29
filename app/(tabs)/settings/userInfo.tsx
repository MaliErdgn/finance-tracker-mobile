// src/screens/UserInfo.tsx

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/Colors';

const UserInfo = () => {
    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.text}>User Info / Personal Info</Text>
        </SafeAreaView>
    );
};

export default UserInfo;

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

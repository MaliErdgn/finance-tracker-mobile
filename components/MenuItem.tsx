// src/components/MenuItem.tsx

import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface MenuItemProps {
    iconName: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
    title: string;
    onPress: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ iconName, title, onPress }) => {
    return (
        <TouchableOpacity style={styles.menuItem} onPress={onPress}>
            <MaterialCommunityIcons name={iconName} size={24} color={Colors.dark.text} />
            <Text style={styles.menuText}>{title}</Text>
        </TouchableOpacity>
    );
};

export default MenuItem;

const styles = StyleSheet.create({
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.dark.surfaceItems,
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: Colors.dark.primary,
    },
    menuText: {
        color: Colors.dark.text,
        fontSize: 16,
        marginLeft: 15,
    },
});

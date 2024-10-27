// CustomPopup.tsx
import React, { useEffect } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '@/constants/Colors';

interface CustomPopupProps {
    visible: boolean;
    message: string;
    onClose: () => void;
    duration?: number; // Duration in milliseconds
}

const CustomPopup: React.FC<CustomPopupProps> = ({ visible, message, onClose, duration = 3000 }) => {
    const opacity = React.useRef(new Animated.Value(0)).current;

    useEffect(() => {
        let timer: NodeJS.Timeout;

        if (visible) {
            // Fade in
            Animated.timing(opacity, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();

            // Auto close after duration
            timer = setTimeout(() => {
                handleClose();
            }, duration);
        }

        return () => {
            if (timer) {
                clearTimeout(timer);
            }
        };
    }, [visible]);

    const handleClose = () => {
        // Fade out
        Animated.timing(opacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            onClose();
        });
    };

    if (!visible) return null;

    return (
        <Animated.View style={[styles.container, { opacity }]}>
            <View style={styles.popup}>
                <Text style={styles.message}>{message}</Text>
                <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                    <Text style={styles.closeButtonText}>Dismiss</Text>
                </TouchableOpacity>
            </View>
        </Animated.View>
    );
};

export default CustomPopup;

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: '20%', // Adjust as needed
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 1000,
    },
    popup: {
        backgroundColor: Colors.dark.surfaceItems,
        borderRadius: 10,
        padding: 20,
        width: '80%',
        borderColor: Colors.dark.primary,
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    message: {
        color: Colors.dark.text,
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 10,
    },
    closeButton: {
        alignSelf: 'center',
        paddingVertical: 6,
        paddingHorizontal: 12,
        backgroundColor: Colors.dark.primary,
        borderRadius: 5,
    },
    closeButtonText: {
        color: Colors.dark.text,
        fontWeight: 'bold',
    },
});

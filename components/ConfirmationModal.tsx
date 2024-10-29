// src/components/ConfirmationModal.tsx

import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View, TouchableWithoutFeedback } from 'react-native';
import { Colors } from '@/constants/Colors';

interface ConfirmationModalProps {
    visible: boolean;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ visible, message, onConfirm, onCancel }) => {
    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onCancel}
        >
            <TouchableWithoutFeedback onPress={onCancel}>
                <View style={styles.overlay}>
                    <TouchableWithoutFeedback>
                        <View style={styles.modalContainer}>
                            <Text style={styles.message}>{message}</Text>
                            <View style={styles.buttonContainer}>
                                <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
                                    <Text style={styles.cancelButtonText}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
                                    <Text style={styles.confirmButtonText}>Confirm</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

export default ConfirmationModal;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '80%',
        backgroundColor: Colors.dark.surfaceItems,
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    message: {
        color: Colors.dark.text,
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    cancelButton: {
        flex: 1,
        backgroundColor: Colors.dark.primary,
        padding: 10,
        borderRadius: 5,
        marginRight: 10,
        alignItems: 'center',
    },
    cancelButtonText: {
        color: Colors.dark.text,
        fontWeight: 'bold',
    },
    confirmButton: {
        flex: 1,
        backgroundColor: Colors.dark.errors,
        padding: 10,
        borderRadius: 5,
        marginLeft: 10,
        alignItems: 'center',
    },
    confirmButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

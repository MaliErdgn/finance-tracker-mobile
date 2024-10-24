import { Modal, StyleSheet, Text, TouchableOpacity, View, TouchableWithoutFeedback } from 'react-native';
import React from 'react';
import { Colors } from '@/constants/Colors';

interface DeleteDataProps {
    deleting: boolean;
    setDeleting: React.Dispatch<React.SetStateAction<boolean>>;
    deletingId: number | null;
    deletingAmount: number | null;
    deletingTime: string | null;
    deletingDesc: string | null;
    handleDelete: () => void;
}

const DeleteData: React.FC<DeleteDataProps> = ({ deleting, setDeleting, deletingId, deletingAmount, deletingTime, deletingDesc, handleDelete }) => {
    return (
        <Modal
            visible={deleting}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setDeleting(false)}
        >
            <TouchableWithoutFeedback onPress={() => setDeleting(false)}>
                <View style={styles.overlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalText}>Are you sure you want to delete the following item?</Text>
                        {deletingId !== null && (
                            <>
                                <Text style={styles.modalDetailText}>ID: {deletingId}</Text>
                                <Text style={styles.modalDetailText}>Amount: {deletingAmount}</Text>
                                <Text style={styles.modalDetailText}>Time: {deletingTime}</Text>
                                <Text style={styles.modalDetailText}>Description: {deletingDesc}</Text>
                            </>
                        )}
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.cancelButton} onPress={() => setDeleting(false)}>
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete()}>
                                <Text style={styles.deleteButtonText}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

export default DeleteData;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: '80%',
        padding: 20,
        backgroundColor: Colors.dark.surfaceItems,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    modalText: {
        color: Colors.dark.text,
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
    modalDetailText: {
        color: Colors.dark.text,
        fontSize: 14,
        textAlign: 'left',
        marginBottom: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    cancelButton: {
        flex: 1,
        paddingVertical: 10,
        marginRight: 10,
        backgroundColor: Colors.dark.surfaceItems,
        borderRadius: 5,
        alignItems: 'center',
        borderColor: Colors.dark.primary,
        borderWidth: 1,
    },
    cancelButtonText: {
        color: Colors.dark.text,
        fontWeight: 'bold',
    },
    deleteButton: {
        flex: 1,
        paddingVertical: 10,
        backgroundColor: Colors.dark.errors,
        borderRadius: 5,
        alignItems: 'center',
    },
    deleteButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

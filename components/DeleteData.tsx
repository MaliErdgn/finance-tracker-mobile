import { Modal, StyleSheet, Text, TouchableOpacity, View, TouchableWithoutFeedback } from 'react-native';
import React from 'react';
import { Colors } from '@/constants/Colors';
import { DataType } from '@/constants/Types';

interface DeleteDataProps {
    deleting: boolean;
    setDeleting: React.Dispatch<React.SetStateAction<boolean>>;
    itemToDelete: DataType | null;
    handleDelete: (item: DataType | null) => void;
    AssignMethod: (id: number) => string;
    AssignType: (id: number) => string;
    AssignTag: (id: number) => string;
    AssignCategory: (tagId: number) => string;
}

const DeleteData: React.FC<DeleteDataProps> = ({ deleting, setDeleting, itemToDelete, handleDelete, AssignCategory, AssignMethod, AssignTag, AssignType }) => {
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
                        {itemToDelete && (
                            <>
                                <Text style={styles.modalDetailText}>Amount: {itemToDelete.amount}</Text>
                                <Text style={styles.modalDetailText}>Time: {new Date(itemToDelete.time).toLocaleDateString()}</Text>
                                <Text style={styles.modalDetailText}>Description: {itemToDelete.description}</Text>
                                <Text style={styles.modalDetailText}>Tag: {AssignTag(itemToDelete.tag_id)}</Text>
                                <Text style={styles.modalDetailText}>Category: {AssignCategory(itemToDelete.tag_id)}</Text>
                                <Text style={styles.modalDetailText}>Method: {AssignMethod(itemToDelete.method_id)}</Text>
                                <Text style={styles.modalDetailText}>Type: {AssignType(itemToDelete.type_id)}</Text>
                            </>
                        )}
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.cancelButton} onPress={() => setDeleting(false)}>
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(itemToDelete)}>
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

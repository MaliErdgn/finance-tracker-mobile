// src/components/DeleteTag.tsx

import React from 'react';
import {
    Modal,
    StyleSheet,
    View,
    TouchableWithoutFeedback,
    TouchableOpacity,
} from 'react-native';
import { Text } from '@rneui/base';
import { Colors } from '@/constants/Colors';
import { Tag } from '@/constants/Types';

interface DeleteTagProps {
    visible: boolean;
    setVisible: React.Dispatch<React.SetStateAction<boolean>>;
    tag: Tag | null;
    onDelete: () => void;
    getCategoryName: (categoryId: number) => string;
}

const DeleteTag: React.FC<DeleteTagProps> = ({
    visible,
    setVisible,
    tag,
    onDelete,
    getCategoryName,
}) => {
    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setVisible(false)}
        >
            <TouchableWithoutFeedback onPress={() => setVisible(false)}>
                <View style={styles.overlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalText}>
                            Are you sure you want to delete the following tag?
                        </Text>
                        {tag && (
                            <>
                                <Text style={styles.modalDetailText}>
                                    Tag Name: {tag.tag_name}
                                </Text>
                                <Text style={styles.modalDetailText}>
                                    Category: {getCategoryName(tag.category_id)}
                                </Text>
                            </>
                        )}
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={() => setVisible(false)}
                            >
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
                                <Text style={styles.deleteButtonText}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

export default DeleteTag;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: '80%',
        padding: 20,
        backgroundColor: Colors.dark.surfaceItems,
        borderRadius: 10,
        borderColor: Colors.dark.primary,
        borderWidth: 1,
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

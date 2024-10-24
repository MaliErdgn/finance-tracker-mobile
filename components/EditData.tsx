import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '@/constants/Colors';

interface EditDataProps {
    editing: boolean;
    setEditing: React.Dispatch<React.SetStateAction<boolean>>;
    editingId: number | null;
    editingData: () => void;
}


const EditData: React.FC<EditDataProps> = ({
    editing,
    setEditing,
    editingId,
    editingData,
}) => {
    return (
        <Modal
            visible={editing}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setEditing(false)}
        >
            <View style={{ padding: 20, backgroundColor: Colors.dark.surfaceItems }}>
                <Text style={{ color: Colors.dark.text }}>
                    Are you sure you want to edit item with ID: {editingId}?
                </Text>
                <TouchableOpacity onPress={() => editingData()}>
                    <Text style={{ color: Colors.dark.text }}>Edit</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    );
};

export default EditData;

const styles = StyleSheet.create({});

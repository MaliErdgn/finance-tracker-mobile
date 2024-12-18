// src/components/EditTag.tsx

import React, { useState, useEffect } from 'react';
import {
    Modal,
    StyleSheet,
    View,
    TouchableWithoutFeedback,
    TextInput,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Alert,
} from 'react-native';
import { Text } from '@rneui/base';
import DropDownPicker from 'react-native-dropdown-picker';
import { Colors } from '@/constants/Colors';
import { Tag, Category } from '@/constants/Types';
import { Feather } from '@expo/vector-icons';

interface EditTagProps {
    visible: boolean;
    setVisible: React.Dispatch<React.SetStateAction<boolean>>;
    tag: Tag | null;
    categories: Category[] | null;
    onSave: (tagData: { tag_name: string; category_id: number; id?: number }) => void;
}

const EditTag: React.FC<EditTagProps> = ({
    visible,
    setVisible,
    tag,
    categories,
    onSave,
}) => {
    const [tagName, setTagName] = useState<string>('');
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

    const [categoryOpen, setCategoryOpen] = useState(false);
    const [categoryItems, setCategoryItems] = useState<any[]>([]);

    // Initialize category items
    useEffect(() => {
        if (categories) {
            setCategoryItems(
                categories.map((c) => ({
                    label: c.category_name,
                    value: c.id,
                }))
            );
        }
    }, [categories]);

    // Initialize form fields when editing a tag
    useEffect(() => {
        if (tag) {
            setTagName(tag.tag_name);
            setSelectedCategory(tag.category_id);
        } else {
            setTagName('');
            setSelectedCategory(null);
        }
    }, [tag]);

    const onCategoryOpen = () => {
        // Close other dropdowns if any
    };

    const handleSave = () => {
        if (!tagName || selectedCategory === null) {
            Alert.alert('Error', 'Please enter a tag name and select a category.');
            return;
        }

        const tagData = {
            tag_name: tagName,
            category_id: selectedCategory,
            id: tag ? tag.id : undefined,
        };

        onSave(tagData);
        setVisible(false);
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setVisible(false)}
        >
            <TouchableWithoutFeedback onPress={() => setVisible(false)}>
                <View style={styles.overlay}>
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                        style={styles.keyboardAvoidingView}
                    >
                        <TouchableWithoutFeedback>
                            <View style={styles.modalContainer}>
                                <ScrollView
                                    nestedScrollEnabled={true}
                                    contentContainerStyle={{ flexGrow: 1 }}
                                    keyboardShouldPersistTaps="handled"
                                >
                                    <Text style={styles.modalText}>
                                        {tag ? 'Edit Tag' : 'Add New Tag'}
                                    </Text>

                                    {/* Tag Name Input */}
                                    <Text style={styles.fieldLabel}>Tag Name</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={tagName}
                                        onChangeText={setTagName}
                                    />

                                    {/* Category Picker */}
                                    <Text style={styles.fieldLabel}>Category</Text>
                                    <DropDownPicker
                                        open={categoryOpen}
                                        value={selectedCategory}
                                        items={categoryItems}
                                        setOpen={setCategoryOpen}
                                        setValue={setSelectedCategory}
                                        setItems={setCategoryItems}
                                        onOpen={onCategoryOpen}
                                        style={styles.dropdown}
                                        dropDownContainerStyle={styles.dropdownContainer}
                                        placeholderStyle={styles.placeholder}
                                        labelStyle={styles.labelStyle}
                                        textStyle={styles.textStyle}
                                        placeholder="Select Category"
                                        zIndex={5000}
                                        zIndexInverse={1000}
                                        listMode="MODAL"
                                        modalProps={{
                                            animationType: 'slide',
                                            hardwareAccelerated: true,
                                            transparent: false,
                                        }}
                                        modalTitle="Select a Category"
                                        searchable={true}
                                        searchPlaceholder="Search..."
                                        ArrowDownIconComponent={() => (
                                            <Feather name="chevron-down" size={20} color={Colors.dark.text} />
                                        )}
                                        ArrowUpIconComponent={() => (
                                            <Feather name="chevron-up" size={20} color={Colors.dark.text} />
                                        )}
                                        modalContentContainerStyle={styles.modalContentContainerStyle}
                                        modalTitleStyle={styles.modalTitleStyle}
                                        searchContainerStyle={styles.searchContainerStyle}
                                        searchTextInputStyle={styles.searchTextInputStyle}
                                        listItemContainerStyle={styles.listItemContainerStyle}
                                        listItemLabelStyle={styles.listItemLabelStyle}
                                        closeIconContainerStyle={styles.closeIconContainerStyle}
                                        closeIconStyle={styles.closeIconStyle}
                                    />

                                    {/* Save Button */}
                                    <View style={styles.buttonContainer}>
                                        <TouchableOpacity
                                            style={styles.cancelButton}
                                            onPress={() => setVisible(false)}
                                        >
                                            <Text style={styles.cancelButtonText}>Cancel</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                                            <Text style={styles.saveButtonText}>Save</Text>
                                        </TouchableOpacity>
                                    </View>
                                </ScrollView>
                            </View>
                        </TouchableWithoutFeedback>
                    </KeyboardAvoidingView>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

export default EditTag;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black
    },
    keyboardAvoidingView: {
        flex: 1,
        justifyContent: 'center',
    },
    modalContainer: {
        maxHeight: '90%',
        padding: 15,
        backgroundColor: Colors.dark.background, // Dominant color
        borderRadius: 8,
        borderColor: Colors.dark.surfaceItems, // Secondary color
        borderWidth: 1,
        alignSelf: 'center',
        width: '95%',
    },
    modalText: {
        color: Colors.dark.text,
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 15,
    },
    fieldLabel: {
        color: Colors.dark.text,
        fontSize: 14,
        marginBottom: 5,
    },
    input: {
        backgroundColor: Colors.dark.surfaceItems, // Secondary color
        color: Colors.dark.text,
        borderWidth: 1,
        borderColor: Colors.dark.surfaceItems, // Secondary color
        borderRadius: 5,
        paddingHorizontal: 8,
        paddingVertical: 6,
        marginBottom: 12,
    },
    dropdown: {
        backgroundColor: Colors.dark.surfaceItems, // Secondary color
        borderColor: Colors.dark.surfaceItems, // Secondary color
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 12,
    },
    dropdownContainer: {
        backgroundColor: Colors.dark.surfaceItems, // Secondary color
        borderColor: Colors.dark.surfaceItems, // Secondary color
        borderWidth: 1,
    },
    placeholder: {
        color: Colors.dark.text,
    },
    labelStyle: {
        color: Colors.dark.text,
        fontSize: 14,
    },
    textStyle: {
        color: Colors.dark.text,
        fontSize: 14,
    },
    listItemLabel: {
        color: Colors.dark.text,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,
    },
    cancelButton: {
        flex: 1,
        paddingVertical: 10,
        marginRight: 8,
        backgroundColor: Colors.dark.surfaceItems, // Secondary color
        borderRadius: 5,
        alignItems: 'center',
        borderColor: Colors.dark.surfaceItems, // Secondary color
        borderWidth: 1,
    },
    cancelButtonText: {
        color: Colors.dark.text,
        fontWeight: 'bold',
    },
    saveButton: {
        flex: 1,
        paddingVertical: 10,
        backgroundColor: Colors.dark.accent, // Accent color (purple)
        borderRadius: 5,
        alignItems: 'center',
    },
    saveButtonText: {
        color: Colors.dark.text,
        fontWeight: 'bold',
    },
    // Modal Styling
    modalContentContainerStyle: {
        backgroundColor: Colors.dark.background, // Dominant color
        flex: 1,
    },
    modalTitleContainerStyle: {
        backgroundColor: Colors.dark.surfaceItems, // Secondary color
        padding: 15,
        borderBottomWidth: 1,
        borderColor: Colors.dark.surfaceItems, // Secondary color
    },
    modalTitleStyle: {
        color: Colors.dark.text,
        fontSize: 18,
        fontWeight: 'bold',
    },
    searchContainerStyle: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: Colors.dark.surfaceItems, // Secondary color
        borderBottomWidth: 1,
        borderColor: Colors.dark.surfaceItems, // Secondary color
    },
    searchTextInputStyle: {
        backgroundColor: Colors.dark.surfaceItems, // Secondary color
        borderRadius: 8,
        color: Colors.dark.text,
        paddingVertical: Platform.OS === 'ios' ? 10 : 5,
        paddingHorizontal: 10,
    },
    listItemContainerStyle: {
        backgroundColor: Colors.dark.surfaceItems, // Secondary color
        borderBottomWidth: 1,
        borderColor: Colors.dark.background, // Dominant color
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    listItemLabelStyle: {
        color: Colors.dark.text,
        fontSize: 16,
    },
    closeIconContainerStyle: {
        position: 'absolute',
        right: 15,
        top: 15,
    },
    closeIconStyle: {
        width: 20,
        height: 20,
        tintColor: Colors.dark.text,
    },
});

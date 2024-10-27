// EditData.tsx
import React, { useState, useEffect, useContext } from 'react';
import {
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    TouchableWithoutFeedback,
    TextInput,
    Platform,
    ScrollView,
} from 'react-native';
import { Colors } from '@/constants/Colors';
import { DataType } from '@/constants/Types';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import DropDownPicker from 'react-native-dropdown-picker';
import {
    CategoryDataContext,
    MethodDataContext,
    TagDataContext,
    TypeDataContext,
} from '@/constants/Context';
import moment from 'moment';
import { Feather } from '@expo/vector-icons';

interface EditDataProps {
    editing: boolean;
    setEditing: React.Dispatch<React.SetStateAction<boolean>>;
    itemToEdit: DataType | null;
    handleEdit: (item: DataType | null, updatedData: any) => void;
}
// Custom Arrow Down Component
const CustomArrowDown = () => (
    <Feather name="chevron-down" size={20} color={Colors.dark.text} />
);

// Custom Arrow Up Component
const CustomArrowUp = () => (
    <Feather name="chevron-up" size={20} color={Colors.dark.text} />
);


const EditData: React.FC<EditDataProps> = ({
    editing,
    setEditing,
    itemToEdit,
    handleEdit,
}) => {
    const { tags } = useContext(TagDataContext);
    const { methods } = useContext(MethodDataContext);
    const { types } = useContext(TypeDataContext);
    const { category } = useContext(CategoryDataContext);

    // Amount
    const [amount, setAmount] = useState<string>('');

    // Date
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    // Description
    const [description, setDescription] = useState<string>('');

    // Dropdowns
    // Category
    const [categoryOpen, setCategoryOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [categoryItems, setCategoryItems] = useState<any[]>([]);

    // Tag
    const [tagOpen, setTagOpen] = useState(false);
    const [selectedTag, setSelectedTag] = useState<number | null>(null);
    const [tagItems, setTagItems] = useState<any[]>([]);

    // Method
    const [methodOpen, setMethodOpen] = useState(false);
    const [selectedMethod, setSelectedMethod] = useState<number | null>(null);
    const [methodItems, setMethodItems] = useState<any[]>([]);

    // Type
    const [typeOpen, setTypeOpen] = useState(false);
    const [selectedType, setSelectedType] = useState<number | null>(null);
    const [typeItems, setTypeItems] = useState<any[]>([]);

    // Initialize the state with the itemToEdit data
    useEffect(() => {
        if (itemToEdit) {
            setAmount(itemToEdit.amount.toString());
            setSelectedDate(moment(itemToEdit.time).format('YYYY-MM-DD'));
            setSelectedMethod(itemToEdit.method_id);
            setSelectedType(itemToEdit.type_id);
            setDescription(itemToEdit.description || '');

            // Determine category and tag based on tag_id
            const tag = tags?.find((t) => t.id === itemToEdit.tag_id);
            if (tag) {
                setSelectedTag(tag.id);
                setSelectedCategory(tag.category_id);
            }
        }
    }, [itemToEdit, tags]);

    // Set up category items
    useEffect(() => {
        setCategoryItems(
            category?.map((c) => ({ label: c.category_name, value: c.id })) || []
        );
    }, [category]);

    // Set up method items
    useEffect(() => {
        setMethodItems(
            methods?.map((m) => ({ label: m.method_name, value: m.id })) || []
        );
    }, [methods]);

    // Set up type items
    useEffect(() => {
        setTypeItems(
            types?.map((ty) => ({ label: ty.type_name, value: ty.id })) || []
        );
    }, [types]);

    // Update tagItems when selectedCategory changes
    useEffect(() => {
        const filteredTags = selectedCategory
            ? tags?.filter((tag) => tag.category_id === selectedCategory)
            : [];
        setTagItems(
            filteredTags?.map((t) => ({ label: t.tag_name, value: t.id })) || []
        );
        if (filteredTags && filteredTags.length > 0) {
            setSelectedTag(filteredTags[0].id);
        } else {
            setSelectedTag(null);
        }
    }, [selectedCategory, tags]);

    // Close other dropdowns when one is opened
    const onCategoryOpen = () => {
        setTagOpen(false);
        setMethodOpen(false);
        setTypeOpen(false);
    };

    const onTagOpen = () => {
        setCategoryOpen(false);
        setMethodOpen(false);
        setTypeOpen(false);
    };

    const onMethodOpen = () => {
        setCategoryOpen(false);
        setTagOpen(false);
        setTypeOpen(false);
    };

    const onTypeOpen = () => {
        setCategoryOpen(false);
        setTagOpen(false);
        setMethodOpen(false);
    };

    // Date Picker Handlers
    const handleConfirmDate = (date: Date) => {
        setSelectedDate(moment(date).format('YYYY-MM-DD'));
        setDatePickerVisibility(false);
    };

    // Submit Edited Data
    const submitEdit = () => {
        if (itemToEdit) {
            const updatedData = {
                amount: parseFloat(amount),
                time: selectedDate,
                description: description,
                type_id: selectedType,
                tag_id: selectedTag,
                method_id: selectedMethod,
            };
            handleEdit(itemToEdit, updatedData);
        }
    };

    return (
        <Modal
            visible={editing}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setEditing(false)}
        >
            <TouchableWithoutFeedback onPress={() => setEditing(false)}>
                <View style={styles.overlay}>
                    <View style={styles.modalContainer}>
                        <ScrollView
                            nestedScrollEnabled={true}
                            contentContainerStyle={{ flexGrow: 1 }}
                            keyboardShouldPersistTaps="handled"
                        >
                            <Text style={styles.modalText}>Edit Item</Text>

                            {/* Amount Input */}
                            <Text style={styles.fieldLabel}>Amount</Text>
                            <TextInput
                                style={styles.input}
                                keyboardType="numeric"
                                value={amount}
                                onChangeText={setAmount}
                            />

                            {/* Date Picker */}
                            <Text style={styles.fieldLabel}>Date</Text>
                            <TouchableOpacity
                                onPress={() => setDatePickerVisibility(true)}
                                style={styles.dateButton}
                            >
                                <Text style={styles.dateButtonText}>
                                    {selectedDate
                                        ? moment(selectedDate).format('DD/MM/YYYY')
                                        : 'Select Date'}
                                </Text>
                            </TouchableOpacity>
                            <DateTimePickerModal
                                isVisible={isDatePickerVisible}
                                mode="date"
                                onConfirm={handleConfirmDate}
                                onCancel={() => setDatePickerVisibility(false)}
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
                                listItemLabelStyle={styles.listItemLabel}
                                onChangeValue={(value) => setSelectedCategory(value)}
                                zIndex={5000}
                                zIndexInverse={1000}
                                listMode='SCROLLVIEW'
                                scrollViewProps={{
                                    nestedScrollEnabled: true,
                                }}
                                ArrowDownIconComponent={CustomArrowDown}
                                ArrowUpIconComponent={CustomArrowUp}
                            />

                            {/* Tag Picker */}
                            <Text style={styles.fieldLabel}>Tag</Text>
                            <DropDownPicker
                                open={tagOpen}
                                value={selectedTag}
                                items={tagItems}
                                setOpen={setTagOpen}
                                setValue={setSelectedTag}
                                setItems={setTagItems}
                                onOpen={onTagOpen}
                                style={styles.dropdown}
                                dropDownContainerStyle={styles.dropdownContainer}
                                placeholderStyle={styles.placeholder}
                                labelStyle={styles.labelStyle}
                                textStyle={styles.textStyle}
                                placeholder="Select Tag"
                                listItemLabelStyle={styles.listItemLabel}
                                zIndex={4000}
                                zIndexInverse={2000}
                                listMode='SCROLLVIEW'
                                scrollViewProps={{
                                    nestedScrollEnabled: true,
                                }}
                                ArrowDownIconComponent={CustomArrowDown}
                                ArrowUpIconComponent={CustomArrowUp}
                            />

                            {/* Method Picker */}
                            <Text style={styles.fieldLabel}>Method</Text>
                            <DropDownPicker
                                open={methodOpen}
                                value={selectedMethod}
                                items={methodItems}
                                setOpen={setMethodOpen}
                                setValue={setSelectedMethod}
                                setItems={setMethodItems}
                                onOpen={onMethodOpen}
                                style={styles.dropdown}
                                dropDownContainerStyle={styles.dropdownContainer}
                                placeholderStyle={styles.placeholder}
                                labelStyle={styles.labelStyle}
                                textStyle={styles.textStyle}
                                placeholder="Select Method"
                                listItemLabelStyle={styles.listItemLabel}
                                zIndex={3000}
                                zIndexInverse={3000}
                                listMode='SCROLLVIEW'
                                scrollViewProps={{
                                    nestedScrollEnabled: true,
                                }}
                                ArrowDownIconComponent={CustomArrowDown}
                                ArrowUpIconComponent={CustomArrowUp}
                            />

                            {/* Type Picker */}
                            <Text style={styles.fieldLabel}>Type</Text>
                            <DropDownPicker
                                open={typeOpen}
                                value={selectedType}
                                items={typeItems}
                                setOpen={setTypeOpen}
                                setValue={setSelectedType}
                                setItems={setTypeItems}
                                onOpen={onTypeOpen}
                                style={styles.dropdown}
                                dropDownContainerStyle={styles.dropdownContainer}
                                placeholderStyle={styles.placeholder}
                                labelStyle={styles.labelStyle}
                                textStyle={styles.textStyle}
                                placeholder="Select Type"
                                listItemLabelStyle={styles.listItemLabel}
                                zIndex={2000}
                                zIndexInverse={4000}
                                listMode='SCROLLVIEW'
                                scrollViewProps={{
                                    nestedScrollEnabled: true,
                                }}
                                ArrowDownIconComponent={CustomArrowDown}
                                ArrowUpIconComponent={CustomArrowUp}
                            />

                            {/* Description Input */}
                            <Text style={styles.fieldLabel}>Description</Text>
                            <TextInput
                                style={styles.input}
                                value={description}
                                onChangeText={setDescription}
                            />

                            {/* Submit Button */}
                            <View style={styles.buttonContainer}>
                                <TouchableOpacity
                                    style={styles.cancelButton}
                                    onPress={() => setEditing(false)}
                                >
                                    <Text style={styles.cancelButtonText}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.saveButton} onPress={submitEdit}>
                                    <Text style={styles.saveButtonText}>Save</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

export default EditData;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: '100%',
        maxHeight: '90%',
        padding: 20,
        backgroundColor: Colors.dark.background,
        borderRadius: 10,
        borderColor: Colors.dark.primary,
        borderWidth: 1,
    },
    modalText: {
        color: Colors.dark.text,
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    fieldLabel: {
        color: Colors.dark.text,
        fontSize: 16,
        marginBottom: 5,
    },
    input: {
        backgroundColor: Colors.dark.surfaceItems,
        color: Colors.dark.text,
        borderWidth: 1,
        borderColor: Colors.dark.primary,
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 8,
        marginBottom: 15,
    },
    dateButton: {
        backgroundColor: Colors.dark.surfaceItems,
        borderWidth: 1,
        borderColor: Colors.dark.primary,
        borderRadius: 5,
        paddingVertical: 12,
        paddingHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
    },
    dateButtonText: {
        fontSize: 16,
        color: Colors.dark.text,
    },
    dropdown: {
        color: Colors.dark.text,
        backgroundColor: Colors.dark.surfaceItems,
        borderColor: Colors.dark.primary,
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 15,
    },
    dropdownContainer: {
        backgroundColor: Colors.dark.surfaceItems,
        borderColor: Colors.dark.primary,
        borderWidth: 1,
    },
    listItemLabel: {
        color: Colors.dark.text,
    },
    placeholder: {
        color: Colors.dark.text,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    cancelButton: {
        flex: 1,
        paddingVertical: 12,
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
    saveButton: {
        flex: 1,
        paddingVertical: 12,
        backgroundColor: Colors.dark.primary,
        borderRadius: 5,
        alignItems: 'center',
    },
    saveButtonText: {
        color: Colors.dark.text,
        fontWeight: 'bold',
    },
    labelStyle: {
        color: Colors.dark.text,
    },
    textStyle: {
        color: Colors.dark.text,
    },
    arrowIcon: {
        tintColor: Colors.dark.text,
    },
});

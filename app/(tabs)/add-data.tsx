import {
  Button,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";
import { Input } from "@rneui/base";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import {
  CategoryDataContext,
  ExpenseDataContext,
  MethodDataContext,
  TagDataContext,
  TypeDataContext,
} from "@/constants/Context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import DateTimePickerModal from "react-native-modal-datetime-picker";


const addData = () => {
  const { data } = useContext(ExpenseDataContext);
  const { tags } = useContext(TagDataContext);
  const { methods } = useContext(MethodDataContext);
  const { types } = useContext(TypeDataContext);
  const { category } = useContext(CategoryDataContext);

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Show Date Picker
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  // Hide Date Picker
  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  // Handle Confirm Date
  const handleConfirm = (date: any) => {
    setSelectedDate(date.toLocaleDateString()); // Set the selected date
    hideDatePicker(); // Close the picker
  };

  return (
    // <KeyboardAvoidingView
    //   enabled={true}
    //   behavior={Platform.OS === "ios" ? "padding" : "height"}
    //   keyboardVerticalOffset={Platform.select({ ios: 0, android: 60 })}
    //   style={{ flex: 1, backgroundColor: Colors.dark.background }}
    // >
    <SafeAreaView style={[styles.container, { flex: 1 }]}>
      {/* <ScrollView contentContainerStyle={{ flexGrow: 1 }}> */}
      <View style={styles.background}>
        <KeyboardAwareScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          enableOnAndroid={true}
          extraScrollHeight={Platform.OS === "ios" ? 0 : 80}
          keyboardOpeningTime={0}
        >
          <View style={styles.mainContainer}>
            <View style={styles.headerTextStyle}>
              <Text
                style={{
                  color: Colors.dark.text,
                  fontSize: 24,
                  fontWeight: "bold",
                }}
              >
                Add New Data
              </Text>
            </View>
            <View style={styles.view}>
              {/* Amount */}
              <Input
                label={"Enter The Amount"}
                keyboardType="numeric"
                inputMode="numeric"
                placeholderTextColor={Colors.dark.text}
                inputStyle={styles.amountInput}
                leftIcon={
                  <MaterialCommunityIcons
                    name="cash"
                    size={24}
                    color={Colors.dark.text}
                  ></MaterialCommunityIcons>
                }
                containerStyle={{ paddingHorizontal: 0 }}
                inputContainerStyle={{
                  paddingHorizontal: 0,
                  borderColor: Colors.dark.primary,
                }}
              ></Input>
              {/* Time */}

              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>Select Date</Text>
                <View style={styles.dateContainer}>
                  <TouchableOpacity
                    style={styles.dateButtonStyle}
                    onPress={showDatePicker}
                  >
                    <Text style={styles.dateButtonText}>
                      {selectedDate ? selectedDate : "Select Date"}
                    </Text>
                    <DateTimePickerModal
                      isVisible={isDatePickerVisible}
                      mode="date"
                      onConfirm={handleConfirm}
                      onCancel={hideDatePicker}
                    />

                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.todayButtonStyle}
                    onPress={() =>
                      setSelectedDate(new Date().toLocaleDateString())
                    }
                  >
                    <Text style={styles.dateButtonText}>Today</Text>
                  </TouchableOpacity>
                </View>
              </View>
              {/* Categories */}
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>Category</Text>
                <Picker
                  mode="dropdown"
                  dropdownIconColor={Colors.dark.primary}
                  style={styles.picker}
                >
                  {category?.map((c) => (
                    <Picker.Item
                      key={c.id}
                      label={c.category_name}
                      value={c.category_name}
                      style={styles.pickerItem}
                    ></Picker.Item>
                  ))}
                </Picker>
              </View>
              {/* Tags */}
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>Tag</Text>
                <Picker
                  mode="dropdown"
                  dropdownIconColor={Colors.dark.primary}
                  style={styles.picker}
                >
                  {tags?.map((t) => (
                    <Picker.Item
                      key={t.id}
                      label={t.tag_name}
                      value={t.tag_name}
                      style={styles.pickerItem}
                    ></Picker.Item>
                  ))}
                </Picker>
              </View>
              <View style={styles.methodTypeContainer}>
                <View style={[styles.fieldContainer, { flex: 1 }]}>
                  <Text style={styles.fieldLabel}>Method</Text>
                  <Picker
                    mode="dropdown"
                    dropdownIconColor={Colors.dark.primary}
                    style={styles.picker}
                  >
                    {methods?.map((m) => (
                      <Picker.Item
                        key={m.id}
                        label={m.method_name}
                        value={m.method_name}
                        style={styles.pickerItem}
                      ></Picker.Item>
                    ))}
                  </Picker>
                </View>
                {/* Types */}
                <View
                  style={[styles.fieldContainer, { flex: 1, marginLeft: 10 }]}
                >
                  <Text style={styles.fieldLabel}>Type</Text>
                  <Picker
                    mode="dropdown"
                    dropdownIconColor={Colors.dark.primary}
                    style={styles.picker}
                  >
                    {types?.map((ty) => (
                      <Picker.Item
                        key={ty.id}
                        label={ty.type_name}
                        value={ty.type_name}
                        style={styles.pickerItem}
                      ></Picker.Item>
                    ))}
                  </Picker>
                </View>
              </View>

              {/* Description */}
              <Input
                label="Description"
                inputMode="text"
                keyboardType="default"
                placeholderTextColor={Colors.dark.text}
                inputStyle={styles.amountInput}
                leftIcon={
                  <MaterialCommunityIcons
                    name="card-text"
                    size={24}
                    color={Colors.dark.text}
                  ></MaterialCommunityIcons>
                }
                containerStyle={{ paddingHorizontal: 0 }}
                inputContainerStyle={{
                  paddingHorizontal: 0,
                  borderColor: Colors.dark.primary,
                }}
              ></Input>
              {/* Submit */}
              <TouchableOpacity style={styles.submitButton}>
                <Text style={styles.dateButtonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </View>
      {/* </ScrollView> */}
    </SafeAreaView>
    // </KeyboardAvoidingView>
  );
};

export default addData;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollViewContent: {
    flex: 1,
  },
  background: {
    flex: 1,
    // maxHeight: "100%",
    justifyContent: "center",
    backgroundColor: Colors.dark.background,
    alignItems: "stretch",
  },
  mainContainer: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 20,
  },
  headerTextStyle: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    marginTop: 20,
  },
  view: {
    flex: 1,
    marginBottom: 10,
    marginTop: 20,
    alignSelf: "stretch",
  },
  amountInput: {
    fontSize: 20,
    color: Colors.dark.text,
    padding: 0,
  },
  picker: {
    backgroundColor: Colors.dark.surfaceItems,
  },
  pickerItem: {
    color: Colors.dark.text,
    backgroundColor: Colors.dark.surfaceItems,
  },

  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  dateButtonStyle: {
    flex: 3,
    backgroundColor: Colors.dark.surfaceItems,
    borderWidth: 1,
    borderColor: Colors.dark.primary,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  dateButtonText: {
    fontSize: 18,
    color: Colors.dark.text,
  },

  todayButtonStyle: {
    flex: 1,
    backgroundColor: Colors.dark.surfaceItems,
    borderWidth: 1,
    borderColor: Colors.dark.primary,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  submitButton: {
    backgroundColor: Colors.dark.surfaceItems,
    borderWidth: 1,
    borderColor: Colors.dark.primary,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
  },
  fieldContainer: {
    marginBottom: 20,
  },

  fieldLabel: {
    fontSize: 16,
    color: Colors.dark.text,
    marginBottom: 5,
  },

  methodTypeContainer: {
    flexDirection: "row",
  },
});

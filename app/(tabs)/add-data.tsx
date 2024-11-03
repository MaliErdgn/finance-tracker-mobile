import {
  Platform,
  StyleSheet,
  Text,
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
  MethodDataContext,
  TagDataContext,
  TypeDataContext,
} from "@/constants/Context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { ADD_DATA_API_ADDRESS } from "@/constants/Variables";
import axiosInstance from "@/api/axiosInstance";
import moment from 'moment'
import { useNavigation } from "@react-navigation/native";


const addData = () => {
  const { tags } = useContext(TagDataContext);
  const { methods } = useContext(MethodDataContext);
  const { types } = useContext(TypeDataContext);
  const { category } = useContext(CategoryDataContext);

  const [amount, setAmount] = useState<number>()
  const [selectedTag, setSelectedTag] = useState<number | null>(tags?.find((tag) => tag.tag_name === "Personal")?.id ?? null)
  const [selectedMethod, setSelectedMethod] = useState<number | null>(methods?.find((m) => m.method_name === "Credit Card")?.id ?? null)
  const [selectedType, setSelectedType] = useState<number | null>(types?.find((t) => t.type_name === "Expense")?.id ?? null)
  const [selectedCategory, setSelectedCategory] = useState<number | null>(category?.find((c) => c.category_name === "Personal")?.id ?? null)
  const [selectedDate, setSelectedDate] = useState<string | null>(new Date().toLocaleDateString());
  const [description, setDescription] = useState<string>("")


  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);


  const navigation = useNavigation();

  const filteredTags = selectedCategory ? tags?.filter((tag) => tag.category_id === selectedCategory) : [];




  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date: any) => {
    setSelectedDate(date.toLocaleDateString()); // Set the selected date
    hideDatePicker(); // Close the picker
  };

  const handleDataSubmit = () => {
    const formattedDate = moment(selectedDate, "DD/MM/YYYY").format("YYYY-MM-DD")
    addExpense(formattedDate, description || null);
  }

  const addExpense = async (formattedDate: string, description: string | null) => {
    try {

      const response = await axiosInstance.post(ADD_DATA_API_ADDRESS, {
        amount: amount,
        time: formattedDate,
        description: description,
        type_id: selectedType,
        tag_id: selectedTag,
        method_id: selectedMethod,
      });

      console.log(response.data);
      (navigation as any).navigate("dashboard")
    } catch (error: any) {
      console.error("Error adding expense:", error.response?.data || error.message);
    }
  };


  const onCategoryChange = (value: number | null) => {
    setSelectedCategory(value);
    const matchingTags = tags?.filter((tag) => tag.category_id === value)
    if (matchingTags?.some((tag) => tag.id === selectedTag)) {
      console.log("matchingTags[0].id: ", matchingTags[0].id)
    } else {
      console.log("selected tag does not exist under this category")
      if (matchingTags) {
        setSelectedTag(matchingTags[0].id)
      }
    }
  }

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
                value={amount ? amount.toString() : ""}
                onChangeText={(value) => {
                  // Use parseFloat to handle floating-point numbers correctly
                  const parsedValue = parseFloat(value);
                  if (!isNaN(parsedValue)) {
                    setAmount(parsedValue);
                  } else {
                    setAmount(undefined); // Reset if input is invalid
                  }
                }}
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
                  borderColor: Colors.dark.accent,
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
                  dropdownIconColor={Colors.dark.text}
                  style={styles.picker}
                  selectedValue={selectedCategory}
                  onValueChange={value => onCategoryChange(value)}
                >
                  {category?.map((c) => (
                    <Picker.Item
                      key={c.id}
                      label={c.category_name}
                      value={c.id}
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
                  dropdownIconColor={Colors.dark.text}
                  style={styles.picker}
                  selectedValue={selectedTag}
                  onValueChange={(value) => setSelectedTag(value)}
                >
                  {filteredTags?.map((t) => (
                    <Picker.Item
                      key={t.id}
                      label={t.tag_name}
                      value={t.id}
                      style={styles.pickerItem}
                    ></Picker.Item>
                  ))}
                </Picker>
              </View>
              {/* Methods */}
              <View style={styles.methodTypeContainer}>
                <View style={[styles.fieldContainer, { flex: 1 }]}>
                  <Text style={styles.fieldLabel}>Method</Text>
                  <Picker
                    mode="dropdown"
                    dropdownIconColor={Colors.dark.text}
                    style={styles.picker}
                    selectedValue={selectedMethod}
                    onValueChange={(value) => setSelectedMethod(value)}
                  >
                    {methods?.map((m) => (
                      <Picker.Item
                        key={m.id}
                        label={m.method_name}
                        value={m.id}
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
                    dropdownIconColor={Colors.dark.text}
                    style={styles.picker}
                    selectedValue={selectedType}
                    onValueChange={(value) => setSelectedType(value)}
                  >
                    {types?.map((ty) => (
                      <Picker.Item
                        key={ty.id}
                        label={ty.type_name}
                        value={ty.id}
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
                value={description}
                onChangeText={setDescription}
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
                  borderColor: Colors.dark.accent,
                }}
              ></Input>
              {/* Submit */}
              <TouchableOpacity style={styles.submitButton} onPress={handleDataSubmit}>
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

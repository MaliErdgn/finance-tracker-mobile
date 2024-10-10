import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";
import { Input } from "@rneui/base";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker"
const addData = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.background}>
        <View style={styles.mainContainer}>
          <View style={styles.headerTextStyle}>
            <Text style={{ color: Colors.dark.text, fontSize: 24, fontWeight: 'bold' }}>Add New Data</Text>
          </View>
          <View style={styles.view}>
            <Input label={"Enter The Amount"} keyboardType="numeric" inputMode="numeric" placeholderTextColor={Colors.dark.text} inputStyle={styles.amountInput} leftIcon={<MaterialCommunityIcons name="cash" size={24} color={Colors.dark.text} ></MaterialCommunityIcons>}></Input>
            <Picker mode="dropdown" dropdownIconColor={Colors.dark.primary}></Picker>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default addData;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: Colors.dark.background,
    alignItems: "center",
  },
  mainContainer: {
    flex: 1,
    width: "100 %",
    paddingHorizontal: 20,
  },
  headerTextStyle: {
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    flex: 1
  },
  view: {
    flex: 5,
    backgroundColor: Colors.dark.surfaceItems,
    marginBottom: 10,
    alignSelf: "stretch"
  },
  amountInput: {
    fontSize: 20,
    color: Colors.dark.text,
  }
});

// export default () => {
//   return (
//     <Input
//       containerStyle={{}}
//       disabled
//       disabledInputStyle={{ background: "#ddd" }}
//       inputContainerStyle={{}}
//       errorMessage="Oops! that's not correct."
//       errorStyle={{}}
//       errorProps={{}}
//       inputStyle={{}}
//       label="User Form"
//       labelStyle={{}}
//       labelProps={{}}
//       leftIcon={<Icon name="account-outline" size={20} />}
//       leftIconContainerStyle={{}}
//       rightIcon={<Icon name="close" size={20} />}
//       rightIconContainerStyle={{}}
//       placeholder="Enter Name"
//     />
//   );
// }
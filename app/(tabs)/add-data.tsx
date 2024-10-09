import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";

const addData = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.view}></View>
    </SafeAreaView>
  );
};

export default addData;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  view: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: Colors.dark.background,
    alignItems: "center",
  },
});

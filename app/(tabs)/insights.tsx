import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const insights = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.view}>
        <Text>insights</Text>
      </View>
    </SafeAreaView>
  );
};

export default insights;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  view: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const insights = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.view}>
        {/* Nested Donut Chart (Category and Tags): Inside ring being categories and outisde rings being tags*/}
        {/* Stacked Bar Chart: Can be customizable. The x and y axis will be chosen by the user. */}
        {/* Time Series/Line Chart: To keep track of how much money the user has */}
        {/* Tree Map */}
        {/* Bubble Chart */}
        {/* Pie Chart */}
        {/* Area Chart */}
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

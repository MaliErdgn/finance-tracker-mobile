import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import DonutChart from "@/components/charts-graphs/DonutChart";
import { CategoryDataContext, ExpenseDataContext, MethodDataContext, TagDataContext, TypeDataContext } from "@/constants/Context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";

const insights = () => {
  const { data } = useContext(ExpenseDataContext);
  const { tags } = useContext(TagDataContext);
  const { methods } = useContext(MethodDataContext);
  const { types } = useContext(TypeDataContext);
  const { category } = useContext(CategoryDataContext);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.view}>
        <View style={styles.header}>
          <Text style={{ color: Colors.dark.text }}>Filters</Text>
          <TouchableOpacity style={styles.filter}>
              <MaterialCommunityIcons name="filter" size={20} color={Colors.dark.text}></MaterialCommunityIcons>
          </TouchableOpacity>
        </View>
        {/* Nested Donut Chart (Category and Tags): Inside ring being categories and outisde rings being tags*/}
        <DonutChart />
        {/* Stacked Bar Chart: Can be customizable. The x and y axis will be chosen by the user. */}
        {/* Time Series/Line Chart: To keep track of how much money the user has */}
        {/* Tree Map */}
        {/* Bubble Chart */}
        {/* Pie Chart */}
        {/* Area Chart */}
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
  header: {
    flexDirection: "row"
  },
  filter: {

  }
});
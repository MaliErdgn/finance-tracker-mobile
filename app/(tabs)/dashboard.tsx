import { memo, useCallback, useEffect, useState } from "react";
import {
  StyleSheet,
  Dimensions,
  ScaledSize,
  LayoutAnimation,
  Platform,
  UIManager,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import React from "react";
import { ListItem, Text, Divider, Tooltip } from "@rneui/base";
import { Card } from "@rneui/base";
import { Colors } from "@/constants/Colors";
import {
  CATEGORIES_API_ADDRESS,
  DATA_API_ADDRESS,
  METHOD_API_ADDRESS,
  TAGS_API_ADDRESS,
  TYPES_API_ADDRESS,
} from "@/constants/Variables";
import DataRow from "@/components/DataRow";
import { DataType, Tag, Type, Method, Category } from "@/constants/types";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}



const dashboard = () => {
  const [data, setData] = useState<DataType[] | null>([]);
  const [tags, setTags] = useState<Tag[] | null>([]);
  const [type, setType] = useState<Type[] | null>([]);
  const [method, setMethod] = useState<Method[] | null>([]);
  const [category, setCategory] = useState<Category[] | null>([]);
  const [screenWidth, setScreenWidth] = useState<ScaledSize>(
    Dimensions.get("window")
  );
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  useEffect(() => {
    const handleResize = (): void => {
      setScreenWidth(Dimensions.get("window"));
    };
    const subscription = Dimensions.addEventListener("change", handleResize);

    return () => {
      subscription?.remove();
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(DATA_API_ADDRESS);
        setData(response.data);
      } catch (err) {
        console.error("Failed to fetch expenses: ", err);
      }
    };
    const fetchTags = async () => {
      try {
        const response = await axios.get(TAGS_API_ADDRESS);
        setTags(response.data);
      } catch (err) {
        console.error("Failed to fetch tags", err);
      }
    };
    const fetchMethods = async () => {
      try {
        const response = await axios.get(METHOD_API_ADDRESS);
        setMethod(response.data);
      } catch (err) {
        console.error("Failed to fetch methods", err);
      }
    };
    const fetchTypes = async () => {
      try {
        const response = await axios.get(TYPES_API_ADDRESS);
        setType(response.data);
      } catch (err) {
        console.error("Failed to fetch tags", err);
      }
    };
    const fetchCategories = async () => {
      try {
        const response = await axios.get(CATEGORIES_API_ADDRESS);
        setCategory(response.data);
      } catch (err) {
        console.error("Failed to fetch tags", err);
      }
    };

    fetchData();
    fetchTags();
    fetchMethods();
    fetchTypes();
    fetchCategories();
  }, []);
  const AssignMethod = (id: number): string => {
    const assignedMethod = method?.find((m) => m.id === id);
    if (assignedMethod) {
      return assignedMethod.method_name;
    } else {
      return "Unknown Method";
    }
  };

  const AssignType = (id: number): string => {
    const assignedType = type?.find((t) => t.id === id);
    if (assignedType) {
      return assignedType.type_name;
    } else {
      return "Unknown Type";
    }
  };

  const AssignCategory = (id: number): string => {
    const assignedTag = tags?.find((t) => t.id === id);
    if (assignedTag) {
      const assignedCategory = category?.find(
        (c) => c.id === assignedTag.category_id
      );
      if (assignedCategory) {
        return assignedCategory.category_name;
      } else {
        return "Unknown Category";
      }
    } else {
      return "Unknown Tag for the Category";
    }
  };
  const AssignTag = (id: number): string => {
    const assignedTag = tags?.find((t) => t.id === id);
    if (assignedTag) {
      return assignedTag.tag_name;
    } else {
      return "Unknown Tag";
    }
  };

  const toggleExpand = useCallback((id: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedRow((prevExpandedRow) => (prevExpandedRow === id ? null : id));
  }, []);

  const keyExtractor = (exp: DataType) => exp.id.toString();

  if (!data || data.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }


  return (
    <SafeAreaView style={styles.container}>
      <Card containerStyle={styles.cardStyle}>
        {/* TODO: Fix header stylings */}
        <Card.Title style={styles.cardTitle}>Expense/Income</Card.Title>
        {/* Headers */}
        <ListItem containerStyle={styles.headerContainer}>
          <ListItem.Content>
            <ListItem.Title style={styles.headerText}>Amount</ListItem.Title>
          </ListItem.Content>
          <ListItem.Content>
            <ListItem.Title style={styles.headerText}>Date</ListItem.Title>
          </ListItem.Content>
          <ListItem.Content>
            <ListItem.Title style={styles.headerText}>
              Description
            </ListItem.Title>
          </ListItem.Content>
          <ListItem.Content></ListItem.Content>
        </ListItem>
      </Card>

      {/* Data */}
      <FlatList
        data={data}
        keyExtractor={keyExtractor}
        renderItem={({ item }) => (
          <DataRow
            exp={item}
            isExpanded={expandedRow === item.id}
            toggleExpand={toggleExpand}
            AssignCategory={AssignCategory}
            AssignMethod={AssignMethod}
            AssignTag={AssignTag}
            AssignType={AssignType}
          />
        )}
        // TODO: Change number on web
        initialNumToRender={10}
        maxToRenderPerBatch={5}
        windowSize={10}
        contentContainerStyle={styles.scrollView}
      />
    </SafeAreaView>
  );
};

export default dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
    paddingHorizontal: 10,
  },
  scrollView: {
    flexGrow: 1,
    paddingVertical: 8,
  },
  view: {
    justifyContent: "center",
    alignItems: "center",
  },

  headerText: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#E5E7EB",
  },
  headerContainer: {
    backgroundColor: Colors.dark.surfaceItems,
    alignItems: "center",
  },
  cardStyle: {
    width: "100%",
    alignSelf: "center",
    backgroundColor: Colors.dark.background,
    borderWidth: 0,
    marginHorizontal: 0,
    paddingHorizontal: 0,
    paddingBottom: 5,
  },

  cardTitle: {
    color: "#E5E7EB",
  },

});
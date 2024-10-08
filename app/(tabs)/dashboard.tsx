import { ThemedText } from "@/components/ThemedText";
import { memo, useCallback, useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Dimensions,
  ScaledSize,
  LayoutAnimation,
  Platform,
  UIManager,
  FlatList,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import React from "react";
import { ListItem, Text, Divider, Tooltip } from "react-native-elements";
import { Card } from "@rneui/base";
import { Colors } from "@/constants/Colors";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import {
  CATEGORIES_API_ADDRESS,
  DATA_API_ADDRESS,
  METHOD_API_ADDRESS,
  TAGS_API_ADDRESS,
  TYPES_API_ADDRESS,
} from "@/constants/Variables";

interface DataRowProps {
  exp: DataType;
  isExpanded: boolean;
  toggleExpand: (id: number) => void;
  AssignMethod: (id: number) => string;
  AssignType: (id: number) => string;
  AssignCategory: (id: number) => string;
  AssignTag: (id: number) => string;
}
type DataType = {
  id: number;
  amount: number;
  time: Date;
  description: string;
  type_id: number;
  tag_id: number;
  method_id: number;
};

type Tag = {
  id: number;
  tag_name: string;
  category_id: number;
  category_name: string;
};

type Type = {
  id: number;
  type_name: string;
};

type Method = {
  id: number;
  method_name: string;
};

type Category = {
  id: number;
  category_name: string;
};

//function to format date to our liking
const formatDate = (dateString: Date) => {
  const date = new Date(dateString);
  const day = String(date.getUTCDate()).padStart(2, "0"); // Use UTC to avoid time zone shifts
  const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // UTC month
  const year = date.getUTCFullYear(); // UTC year
  return `${day}.${month}.${year}`;
};

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const DataRow: React.FC<DataRowProps> = memo(
  ({
    exp,
    isExpanded,
    toggleExpand,
    AssignMethod,
    AssignCategory,
    AssignType,
    AssignTag,
  }) => {
    return (
      <React.Fragment key={exp.id}>
        <ListItem
          containerStyle={[
            styles.listItemContainer,
            styles.listItemSpacing,
            isExpanded && styles.listItemContainerExpanded,
          ]}
          onPress={() => toggleExpand(exp.id)}
        >
          <ListItem.Content>
            <Text style={styles.cellText}>{exp.amount}</Text>
          </ListItem.Content>
          <ListItem.Content>
            <Text style={styles.cellText}>{formatDate(exp.time)}</Text>
          </ListItem.Content>
          <ListItem.Content>
            <Text style={styles.cellText}>{exp.description}</Text>
          </ListItem.Content>

          {/* Dropdown Icon */}
          <MaterialCommunityIcons
            name={isExpanded ? "chevron-up" : "chevron-down"}
            size={24}
            color={Colors.dark.primary}
          />
        </ListItem>

        {/* Expanded Content */}
        {isExpanded && (
          <ListItem containerStyle={styles.expandedContent}>
            <ListItem.Content style={{ flexDirection: "column" }}>
              <View style={styles.rowContainer}>
                <Text style={styles.labelText}>Tag Name: </Text>
                <Text style={styles.cellText}>{AssignTag(exp.tag_id)}</Text>
              </View>

              <View style={styles.rowContainer}>
                <Text style={styles.labelText}>Method Name: </Text>
                <Text style={styles.cellText}>
                  {AssignMethod(exp.method_id)}
                </Text>
              </View>

              <View style={styles.rowContainer}>
                <Text style={styles.labelText}>Category Name: </Text>
                <Text style={styles.cellText}>
                  {AssignCategory(exp.tag_id)}
                </Text>
              </View>

              <View style={styles.rowContainer}>
                <Text style={styles.labelText}>Type Name: </Text>
                <Text style={styles.cellText}>{AssignType(exp.type_id)}</Text>
              </View>
              <ListItem.Content
                style={{ alignSelf: "flex-end", flexDirection: "row" }}
              >
                <MaterialCommunityIcons
                  name="pencil"
                  size={24}
                  color={Colors.dark.primary}
                  style={{ alignSelf: "flex-end", marginRight: 15 }}
                />
                <MaterialCommunityIcons
                  name="trash-can"
                  size={24}
                  color={Colors.dark.errors}
                  style={{ alignSelf: "flex-end" }}
                />
              </ListItem.Content>
            </ListItem.Content>
          </ListItem>
        )}
      </React.Fragment>
    );
  },
  (prevProps, nextProps) =>
    prevProps.exp === nextProps.exp &&
    prevProps.isExpanded === nextProps.isExpanded
);

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

  return (
    <SafeAreaView style={styles.container}>
      <Card containerStyle={styles.cardStyle}>
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
        // ItemSeparatorComponent={() => <Divider />}
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
  cellText: {
    fontSize: 14,
    color: Colors.dark.text,
    flex: 2,
    // paddingVertical: 5,
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
  listItemContainer: {
    backgroundColor: Colors.dark.surfaceItems,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
  },
  listItemContainerExpanded: {
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
    borderColor: Colors.dark.primary,
    borderBottomWidth: 1,
  },
  cardTitle: {
    color: "#E5E7EB",
  },
  expandedContent: {
    backgroundColor: Colors.dark.surfaceItems,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  listItemSpacing: {
    marginTop: 5,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginBottom: 5,
  },
  labelText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.dark.text,
    flex: 1,  
    textAlign: 'right',  
    paddingRight: 20,  
  },
});

import { useCallback, useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  Dimensions,
  ScaledSize,
  LayoutAnimation,
  Platform,
  UIManager,
  FlatList,
  View,
  Button,
  Modal,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import React from "react";
import { Text } from "@rneui/base";
import { Colors } from "@/constants/Colors";
import {
  CATEGORIES_API_ADDRESS,
  DATA_API_ADDRESS,
  METHOD_API_ADDRESS,
  TAGS_API_ADDRESS,
  TYPES_API_ADDRESS,
} from "@/constants/Variables";
import DataRow from "@/components/DataRow";
import { DataType, Tag, Type, Method, Category } from "@/constants/Types";
import HeaderArea from "@/components/HeaderArea";
import {
  CategoryDataContext,
  ExpenseDataContext,
  MethodDataContext,
  TagDataContext,
  TypeDataContext,
} from "@/constants/Context";
import { useFocusEffect } from "expo-router";
import PopupDialog from "react-native-popup-dialog";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const dashboard = () => {
  const { data, setData } = useContext(ExpenseDataContext);
  const { tags, setTags } = useContext(TagDataContext);
  const { methods, setMethods } = useContext(MethodDataContext);
  const { types, setTypes } = useContext(TypeDataContext);
  const { category, setCategory } = useContext(CategoryDataContext);

  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  const [sortBy, setSortBy] = useState<string | null>("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const [deleting, setDeleting] = useState<boolean>(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [editing, setEditing] = useState<boolean>(false)
  const [editingId, setEditingId] = useState<number |null>(null)

  useEffect(() => {
    const fetchMethods = async () => {
      try {
        const response = await axios.get(METHOD_API_ADDRESS);
        setMethods(response.data);
      } catch (err) {
        console.error("Failed to fetch methods", err);
      }
    };

    const fetchTypes = async () => {
      try {
        const response = await axios.get(TYPES_API_ADDRESS);
        setTypes(response.data);
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

    fetchMethods();
    fetchTypes();
    fetchCategories();
  }, []);

  useFocusEffect(
    useCallback(() => {
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

      fetchData();
      fetchTags();
    }, [])
  );

  const AssignMethod = (id: number): string => {
    const assignedMethod = methods?.find((m) => m.id === id);
    if (assignedMethod) {
      return assignedMethod.method_name;
    } else {
      return "Unknown Method";
    }
  };

  const AssignType = (id: number): string => {
    const assignedType = types?.find((t) => t.id === id);
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

  const sortData = (data: DataType[]) => {
    if (!sortBy) return data;

    return [...data].sort((a, b) => {
      if (sortBy === "amount") {
        return sortOrder === "asc" ? a.amount - b.amount : b.amount - a.amount;
      } else if (sortBy === "date") {
        const dateA = new Date(a.time).getTime();
        const dateB = new Date(b.time).getTime();
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      } else if (sortBy === "description") {
        const descA = a.description || "";
        const descB = b.description || "";

        return sortOrder === "asc"
          ? descA.localeCompare(descB)
          : descB.localeCompare(descA);
      }
      return 0;
    });
  };

  const deleteData = (id: number) => {
    console.log("Deleting ID: ", id);
    setDeletingId(id);
    setDeleting(true);
  };
  useEffect(() => {
    console.log("Deleting state changed: ", deleting);
  }, [deleting]);

  const deletingData = () => {
    setDeleting(false)
    console.log("ananısikm");
  };

  const editingData = () => {
    setEditing(false)
    console.log("ananısikm ama editleyerek");
  };
  const editData = (id: number) => {
    console.log("editing: ", id);
    setEditingId(id);
    setEditing(true);
  }

  if (!data || data.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <HeaderArea
        setSortBy={setSortBy}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
      ></HeaderArea>
      <Modal
        visible={deleting}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setDeleting(false)}
      >
        <View
          style={{ padding: 20, backgroundColor: Colors.dark.surfaceItems }}
        >
          <Text style={{ color: Colors.dark.text }}>
            Are you sure you want to delete item with ID: {deletingId}?
          </Text>
          <TouchableOpacity onPress={() => deletingData()}>
            <Text style={{ color: Colors.dark.text }}>Delete</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <Modal
        visible={editing}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setEditing(false)}
      >
        <View
          style={{ padding: 20, backgroundColor: Colors.dark.surfaceItems }}
        >
          <Text style={{ color: Colors.dark.text }}>
            Are you sure you want to edit item with ID: {deletingId}?
          </Text>
          <TouchableOpacity onPress={() => editingData()}>
            <Text style={{ color: Colors.dark.text }}>Edit</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      {/* Data */}
      <FlatList
        data={sortData(data)}
        keyExtractor={keyExtractor}
        style={{ padding: 0 }}
        renderItem={({ item }) => (
          <DataRow
            exp={item}
            isExpanded={expandedRow === item.id}
            toggleExpand={toggleExpand}
            AssignCategory={AssignCategory}
            AssignMethod={AssignMethod}
            AssignTag={AssignTag}
            AssignType={AssignType}
            deleting={deleting}
            deleteData={deleteData}
            editing={editing}
            editData={editData}
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
    paddingBottom: 5,
    paddingTop: 0,
  },
  view: {
    justifyContent: "center",
    alignItems: "center",
  },
});

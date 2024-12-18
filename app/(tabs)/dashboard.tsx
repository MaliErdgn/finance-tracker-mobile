import { useCallback, useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
  FlatList,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axiosInstance from "../../api/axiosInstance";
import React from "react";
import { Text } from "@rneui/base";
import { Colors } from "@/constants/Colors";

import DataRow from "@/components/DataRow";
import { DataType } from "@/constants/Types";
import HeaderArea from "@/components/HeaderArea";
import {
  CategoryDataContext,
  ExpenseDataContext,
  MethodDataContext,
  TagDataContext,
  TypeDataContext,
} from "@/constants/Context";
import { useFocusEffect, useRouter } from "expo-router";
import DeleteData from "@/components/DeleteData";
import EditData from "@/components/EditData";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  CATEGORIES_API_ADDRESS,
  DATA_API_ADDRESS,
  DELETE_DATA_API_ADDRESS,
  DELETE_TAG_API_ADDRESS,
  DELETE_USER_API_ADDRESS,
  METHOD_API_ADDRESS,
  TAGS_API_ADDRESS,
  TYPES_API_ADDRESS,
} from "@/constants/Variables";
import CustomPopup from '@/components/CustomPopup';
import { AuthContext } from "@/context/AuthContext";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const Dashboard = () => {
  const router = useRouter();
  const { isAuthenticated, logout } = useContext(AuthContext); // Use logout instead of setIsAuthenticated

  const { data, setData } = useContext(ExpenseDataContext);
  const { tags, setTags } = useContext(TagDataContext);
  const { methods, setMethods } = useContext(MethodDataContext);
  const { types, setTypes } = useContext(TypeDataContext);
  const { category, setCategory } = useContext(CategoryDataContext);

  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<string | null>("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const [deleting, setDeleting] = useState<boolean>(false);
  const [itemToDelete, setItemToDelete] = useState<DataType | null>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [popupVisible, setPopupVisible] = useState<boolean>(false);
  const [popupMessage, setPopupMessage] = useState<string>("");

  const [editing, setEditing] = useState<boolean>(false);
  const [itemToEdit, setItemToEdit] = useState<DataType | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/auth/login");
    }
  }, [isAuthenticated]);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await axiosInstance.get(DATA_API_ADDRESS);
          setData(response.data);
        } catch (err: any) {
          console.error("Failed to fetch expenses: ", err);
          setError("Failed to fetch expenses");
          if (err.response && (err.response.status === 401 || err.response.status === 403)) {
            await AsyncStorage.removeItem("token");
            logout(); // Use logout function to handle unauthorized cases
          }
        } finally {
          setLoading(false);
        }
      };

      const fetchTags = async () => {
        try {
          const response = await axiosInstance.get(TAGS_API_ADDRESS);
          setTags(response.data);
        } catch (err: any) {
          console.error("Failed to fetch tags", err);
          if (err.response && (err.response.status === 401 || err.response.status === 403)) {
            await AsyncStorage.removeItem("token");
            logout();
          }
        }
      };

      const fetchMethods = async () => {
        try {
          const response = await axiosInstance.get(METHOD_API_ADDRESS);
          setMethods(response.data);
        } catch (err: any) {
          console.error("Failed to fetch methods", err);
          if (err.response && (err.response.status === 401 || err.response.status === 403)) {
            await AsyncStorage.removeItem("token");
            logout();
          }
        }
      };

      const fetchTypes = async () => {
        try {
          const response = await axiosInstance.get(TYPES_API_ADDRESS);
          setTypes(response.data);
        } catch (err: any) {
          console.error("Failed to fetch types", err);
          if (err.response && (err.response.status === 401 || err.response.status === 403)) {
            await AsyncStorage.removeItem("token");
            logout();
          }
        }
      };

      const fetchCategories = async () => {
        try {
          const response = await axiosInstance.get(CATEGORIES_API_ADDRESS);
          setCategory(response.data);
        } catch (err: any) {
          console.error("Failed to fetch categories", err);
          if (err.response && (err.response.status === 401 || err.response.status === 403)) {
            await AsyncStorage.removeItem("token");
            logout();
          }
        }
      };

      fetchMethods();
      fetchTypes();
      fetchCategories();

      fetchData();
      fetchTags();
    }, [])
  );

  const AssignMethod = (id: number): string => {
    const assignedMethod = methods?.find((m) => m.id === id);
    return assignedMethod ? assignedMethod.method_name : "Unknown Method";
  };

  const AssignType = (id: number): string => {
    const assignedType = types?.find((t) => t.id === id);
    return assignedType ? assignedType.type_name : "Unknown Type";
  };

  const AssignCategory = (id: number): string => {
    const assignedTag = tags?.find((t) => t.id === id);
    if (assignedTag) {
      const assignedCategory = category?.find(
        (c) => c.id === assignedTag.category_id
      );
      return assignedCategory ? assignedCategory.category_name : "Unknown Category";
    }
    return "Unknown Tag for the Category";
  };

  const AssignTag = (id: number): string => {
    const assignedTag = tags?.find((t) => t.id === id);
    return assignedTag ? assignedTag.tag_name : "Unknown Tag";
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

  const confirmDelete = (item: DataType) => {
    setItemToDelete(item);
    setDeleting(true);
  };


  const handleDelete = async (item: DataType | null) => {
    if (item) {
      try {
        await axiosInstance.put(DELETE_DATA_API_ADDRESS(item.id));
        setData((prevData) => (prevData || []).filter((exp) => exp.id !== item.id));
        setPopupMessage('Item deleted successfully.');
        setPopupVisible(true);
      } catch (error) {
        console.error('Failed to delete item:', error);
        setPopupMessage('Failed to delete item.');
        setPopupVisible(true);
      } finally {
        setDeleting(false);
        setItemToDelete(null);
      }
    }
  };

  const handleEdit = async (item: DataType | null, updatedData: any) => {
    if (item) {
      try {
        await axiosInstance.put(`/expenses/${item.id}/edit`, updatedData);
        setData((prevData) => {
          if (!prevData) return prevData;
          return prevData.map((exp) =>
            exp.id === item.id ? { ...exp, ...updatedData } : exp
          );
        });
        setPopupMessage('Item updated successfully.');
        setPopupVisible(true);
      } catch (error) {
        console.error('Failed to update item:', error);
        setPopupMessage('Failed to update item.');
        setPopupVisible(true);
      } finally {
        setEditing(false);
        setItemToEdit(null);
      }
    }
  };

  const editData = (item: DataType) => {
    setItemToEdit(item);
    setEditing(true);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>{error}</Text>
      </SafeAreaView>
    );
  }

  if (!data || data.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>No data available.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <HeaderArea
        setSortBy={setSortBy}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
      />
      <DeleteData
        deleting={deleting}
        setDeleting={setDeleting}
        itemToDelete={itemToDelete}
        handleDelete={handleDelete}
        AssignMethod={AssignMethod}
        AssignType={AssignType}
        AssignTag={AssignTag}
        AssignCategory={AssignCategory}
      />
      <EditData
        editing={editing}
        setEditing={setEditing}
        itemToEdit={itemToEdit}
        handleEdit={handleEdit}
      />

      <CustomPopup
        visible={popupVisible}
        message={popupMessage}
        onClose={() => setPopupVisible(false)}
      />
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
            confirmDelete={() => confirmDelete(item)}
            editing={editing}
            editData={() => editData(item)}
          />
        )}
        initialNumToRender={10}
        maxToRenderPerBatch={5}
        windowSize={10}
        contentContainerStyle={styles.scrollView}
      />
    </SafeAreaView>
  );
};

export default Dashboard;

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

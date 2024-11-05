// src/app/(tabs)/tags.tsx

import React, { useContext, useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  SectionList,
  TouchableOpacity,
  View,
  Platform,
  UIManager,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@rneui/base';
import { Colors } from '@/constants/Colors';
import axiosInstance from '@/api/axiosInstance';
import { useFocusEffect, useRouter } from 'expo-router';
import {
  TagDataContext,
  CategoryDataContext,
} from '@/constants/Context';
import {
  TAGS_API_ADDRESS,
  CATEGORIES_API_ADDRESS,
  CREATE_TAG_API_ADDRESS,
  EDIT_TAG_API_ADDRESS,
  DELETE_TAG_API_ADDRESS,
} from '@/constants/Variables';
import { Tag, Category } from '@/constants/Types';
import { AuthContext } from '@/context/AuthContext';
import CustomPopup from '@/components/CustomPopup';
import EditTag from '@/components/EditTag';
import DeleteTag from '@/components/DeleteTag';
import TagItem from '@/components/TagItem';
import { Feather } from '@expo/vector-icons';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const Tags = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const { tags, setTags } = useContext(TagDataContext);
  const { category, setCategory } = useContext(CategoryDataContext);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [editing, setEditing] = useState<boolean>(false);
  const [itemToEdit, setItemToEdit] = useState<Tag | null>(null);

  const [deleting, setDeleting] = useState<boolean>(false);
  const [itemToDelete, setItemToDelete] = useState<Tag | null>(null);

  const [popupVisible, setPopupVisible] = useState<boolean>(false);
  const [popupMessage, setPopupMessage] = useState<string>('');

  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      if (!isAuthenticated) {
        router.replace('/auth/login');
        return;
      }

      const fetchTags = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await axiosInstance.get(TAGS_API_ADDRESS);
          setTags(response.data);
        } catch (err: any) {
          console.error('Failed to fetch tags:', err);
          setError('Failed to fetch tags');
          if (
            err.response &&
            (err.response.status === 401 || err.response.status === 403)
          ) {
            await logout();
          }
        } finally {
          setLoading(false);
        }
      };

      const fetchCategories = async () => {
        try {
          const response = await axiosInstance.get(CATEGORIES_API_ADDRESS);
          setCategory(response.data);
        } catch (err: any) {
          console.error('Failed to fetch categories:', err);
          if (
            err.response &&
            (err.response.status === 401 || err.response.status === 403)
          ) {
            await logout();
          }
        }
      };

      fetchTags();
      fetchCategories();
    }, [isAuthenticated])
  );

  const getCategoryName = (categoryId: number): string => {
    const cat = category?.find((c) => c.id === categoryId);
    return cat ? cat.category_name : 'Uncategorized';
  };

  const handleAddTag = () => {
    setItemToEdit(null);
    setEditing(true);
  };

  const handleEditTag = (tag: Tag) => {
    setItemToEdit(tag);
    setEditing(true);
  };

  const confirmDeleteTag = (tag: Tag) => {
    setItemToDelete(tag);
    setDeleting(true);
  };

  const handleSaveTag = async (tagData: {
    tag_name: string;
    category_id: number;
    id?: number;
  }) => {
    try {
      if (tagData.id) {
        // Update existing tag
        await axiosInstance.put(EDIT_TAG_API_ADDRESS(tagData.id), tagData);
        // Update local state
        setTags((prevTags) =>
          prevTags
            ? prevTags.map((tag) =>
              tag.id === tagData.id ? { ...tag, ...tagData } : tag
            )
            : null
        );
        setPopupMessage('Tag updated successfully.');
      } else {
        // Create new tag
        const response = await axiosInstance.post(
          CREATE_TAG_API_ADDRESS,
          tagData
        );
        // Update local state
        setTags((prevTags) =>
          prevTags ? [...prevTags, response.data] : [response.data]
        );
        setPopupMessage('Tag created successfully.');
      }
    } catch (error) {
      console.error('Failed to save tag:', error);
      setPopupMessage('Failed to save tag. Please try again.');
    } finally {
      setPopupVisible(true);
      setEditing(false);
      setItemToEdit(null);
    }
  };

  const handleDeleteTag = async () => {
    if (itemToDelete) {
      try {
        await axiosInstance.put(DELETE_TAG_API_ADDRESS(itemToDelete.id));
        // Update local state
        setTags((prevTags) =>
          prevTags
            ? prevTags.filter((tag) => tag.id !== itemToDelete.id)
            : null
        );
        setPopupMessage('Tag deleted successfully.');
      } catch (error) {
        console.error('Failed to delete tag:', error);
        setPopupMessage('Failed to delete tag. Please try again.');
      } finally {
        setPopupVisible(true);
        setDeleting(false);
        setItemToDelete(null);
      }
    }
  };

  // Group tags under categories
  const groupedData = category?.map((cat) => ({
    title: cat.category_name,
    data: tags?.filter((tag) => tag.category_id === cat.id) || [],
  }));

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

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.addButton} onPress={handleAddTag}>
        <Feather name="plus" size={24} color={Colors.dark.text} />
        <Text style={styles.addButtonText}>Add New Tag</Text>
      </TouchableOpacity>
      <SectionList
        sections={groupedData || []}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TagItem
            tag={item}
            onEdit={() => handleEditTag(item)}
            onDelete={() => confirmDeleteTag(item)}
          />
        )}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionHeader}>{title}</Text>
        )}
        contentContainerStyle={styles.listContent}
        stickySectionHeadersEnabled={false}
      />
      {/* Edit Tag Modal */}
      <EditTag
        visible={editing}
        setVisible={setEditing}
        tag={itemToEdit}
        categories={category}
        onSave={handleSaveTag}
      />
      {/* Delete Tag Modal */}
      <DeleteTag
        visible={deleting}
        setVisible={setDeleting}
        tag={itemToDelete}
        onDelete={handleDeleteTag}
        getCategoryName={getCategoryName}
      />
      {/* Custom Popup */}
      <CustomPopup
        visible={popupVisible}
        message={popupMessage}
        onClose={() => setPopupVisible(false)}
      />
    </SafeAreaView>
  );
};

export default Tags;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
    paddingHorizontal: 10,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.surfaceItems,
    borderWidth: 1,
    borderColor: Colors.dark.primary,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 8,
    marginVertical: 8,
  },
  addButtonText: {
    fontSize: 16,
    color: Colors.dark.text,
    marginLeft: 8,
  },
  listContent: {
    paddingBottom: 20,
  },
  sectionHeader: {
    fontSize: 18,
    color: Colors.dark.text,
    backgroundColor: Colors.dark.background,
    paddingVertical: 5,
    marginTop: 10,
    fontWeight: 'bold',
  },
});

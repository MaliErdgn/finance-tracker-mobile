// src/components/TagItem.tsx

import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from '@rneui/base';
import { Colors } from '@/constants/Colors';
import { Tag } from '@/constants/Types';
import { Feather } from '@expo/vector-icons';

interface TagItemProps {
    tag: Tag;
    onEdit: () => void;
    onDelete: () => void;
}

const TagItem: React.FC<TagItemProps> = ({
    tag,
    onEdit,
    onDelete,
}) => {
    return (
        <View style={styles.tagItem}>
            <Text style={styles.tagName}>{tag.tag_name}</Text>
            <View style={styles.tagActions}>
                <TouchableOpacity onPress={onEdit}>
                    <Feather name="edit" size={20} color={Colors.dark.text} />
                </TouchableOpacity>
                <TouchableOpacity onPress={onDelete} style={styles.deleteIcon}>
                    <Feather name="trash-2" size={20} color={Colors.dark.errors} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default TagItem;

const styles = StyleSheet.create({
    tagItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: Colors.dark.surfaceItems,
        borderWidth: 1,
        borderColor: Colors.dark.primary,
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 8,
        marginVertical: 4,
    },
    tagName: {
        fontSize: 16,
        color: Colors.dark.text,
    },
    tagActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    deleteIcon: {
        marginLeft: 12,
    },
});

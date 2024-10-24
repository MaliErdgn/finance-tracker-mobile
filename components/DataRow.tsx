import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { memo, useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ListItem } from "@rneui/base";
import { DataType } from "@/constants/Types";
import { Colors } from "@/constants/Colors";


const formatDate = (dateString: Date) => {
    const date = new Date(dateString);
    const day = String(date.getUTCDate()).padStart(2, "0"); // Use UTC to avoid time zone shifts
    const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // UTC month
    const year = date.getUTCFullYear(); // UTC year
    return `${day}.${month}.${year}`;
};

interface DataRowProps {
    exp: DataType;
    isExpanded: boolean;
    deleting: boolean;
    editing: boolean;
    toggleExpand: (id: number) => void;
    AssignMethod: (id: number) => string;
    AssignType: (id: number) => string;
    AssignCategory: (id: number) => string;
    AssignTag: (id: number) => string;
    confirmDelete: (id: number) => void;
    editData: (id: number) => void;
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
        deleting,
        confirmDelete,
        editing,
        editData

    }) => {


        const transactionType = AssignType(exp.type_id);
        const transactionStyle = transactionType === "Income" ? styles.Income : styles.Expense;


        return (
            <React.Fragment key={exp.id}>
                <ListItem
                    containerStyle={[
                        styles.listItemContainer,
                        transactionStyle,
                        styles.listItemSpacing,
                        isExpanded && styles.listItemContainerExpanded,
                    ]}
                    onPress={() => toggleExpand(exp.id)}
                >
                    <ListItem.Content style={{ flex: 3 }}>
                        <Text style={styles.cellText}>{exp.amount}</Text>
                    </ListItem.Content>
                    <ListItem.Content style={{ flex: 3, alignItems: "center" }}>
                        <Text style={styles.cellText}>{formatDate(exp.time)}</Text>
                    </ListItem.Content>
                    <ListItem.Content style={{ flex: 5, alignItems: "center" }}>
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
                                <TouchableOpacity onPress={() => editData(exp.id)}>
                                    <MaterialCommunityIcons
                                        name="pencil"
                                        size={24}
                                        color={Colors.dark.primary}
                                        style={{ alignSelf: "flex-end", marginRight: 15 }}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => confirmDelete(exp.id)}>
                                    <MaterialCommunityIcons
                                        name="trash-can"
                                        size={24}
                                        color={Colors.dark.errors}
                                        style={{ alignSelf: "flex-end" }}
                                    />
                                </TouchableOpacity>
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


export default DataRow

const styles = StyleSheet.create({
    listItemContainer: {
        backgroundColor: Colors.dark.surfaceItems,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 10,
    },
    listItemSpacing: {
        marginTop: 5,
    },
    listItemContainerExpanded: {
        borderBottomRightRadius: 0,
        borderBottomLeftRadius: 0,
        // borderColor: Colors.dark.primary,
        borderBottomWidth: 1,
    },
    cellText: {
        fontSize: 14,
        color: Colors.dark.text,
        flex: 2,
        // paddingVertical: 5,
    },
    expandedContent: {
        backgroundColor: Colors.dark.surfaceItems,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
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
    Expense: {
        borderLeftWidth: 4,
        borderColor: Colors.dark.errors,
    },
    Income: {
        borderLeftWidth: 4,
        borderColor: Colors.dark.secondary
    },
})
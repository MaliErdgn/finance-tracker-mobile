import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Colors } from "@/constants/Colors";
import { Card, ListItem } from "@rneui/base";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const HeaderArea = ({
    setSortBy,
    sortOrder,
    setSortOrder,
}: {
    setSortBy: (value: string) => void;
    sortOrder: "asc" | "desc";
    setSortOrder: (value: "asc" | "desc") => void;
}) => {

    const changeSortOrder = () => {
        sortOrder === "asc" ? setSortOrder("desc") : setSortOrder("asc")
    }

    return (
        <Card containerStyle={styles.cardStyle}>
            {/* TODO: Fix header stylings */}
            <Card.Title style={styles.cardTitle}>Expenses/Incomes</Card.Title>
            {/* Headers */}
            <ListItem containerStyle={styles.headerContainer}>
                <ListItem.Content style={{ flex: 3 }}>
                    <TouchableOpacity onPress={() => setSortBy("amount")}>
                        <ListItem.Title style={styles.headerText}>Amount</ListItem.Title>
                    </TouchableOpacity>
                </ListItem.Content>
                <ListItem.Content style={{ flex: 3, alignItems: "center" }}>
                    <TouchableOpacity onPress={() => setSortBy("date")}>
                        <ListItem.Title style={styles.headerText}>Date</ListItem.Title>
                    </TouchableOpacity>
                </ListItem.Content>
                <ListItem.Content style={{ flex: 5, alignItems: "center" }}>
                    <TouchableOpacity
                        onPress={() => {
                            setSortBy("description");
                        }}
                    >
                        <ListItem.Title style={styles.headerText}>
                            Description
                        </ListItem.Title>
                    </TouchableOpacity>
                </ListItem.Content>
                <TouchableOpacity onPress={() => changeSortOrder()}>
                    <ListItem.Content>
                        <MaterialCommunityIcons name={sortOrder === "asc" ? "sort-ascending" : "sort-descending"} size={20} color={Colors.dark.primary}></MaterialCommunityIcons>
                    </ListItem.Content>
                </TouchableOpacity>
            </ListItem>
        </Card>
    );
};

export default HeaderArea;

const styles = StyleSheet.create({
    cardStyle: {
        width: "100%",
        alignSelf: "center",
        backgroundColor: Colors.dark.background,
        borderWidth: 0,
        marginHorizontal: 0,
        paddingHorizontal: 0,
        paddingBottom: 0,
        marginTop: 0,
        paddingTop: 10,
        // marginBottom: 5,
    },

    cardTitle: {
        color: Colors.dark.text,
        padding: 0,
        margin: 0,
    },

    headerText: {
        fontWeight: "bold",
        fontSize: 16,
        color: Colors.dark.text,
    },
    headerContainer: {
        backgroundColor: Colors.dark.surfaceItems,
        alignItems: "center",
        // borderRadius: 10,
        borderBottomWidth: 1,
        borderColor: Colors.dark.primary,
    },
});

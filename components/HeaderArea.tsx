import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Colors } from "@/constants/Colors";
import { Card, ListItem } from '@rneui/base'

const HeaderArea = () => {
    return (
        <Card containerStyle={styles.cardStyle}>
            {/* TODO: Fix header stylings */}
            <Card.Title style={styles.cardTitle}>Expenses/Incomes</Card.Title>
            {/* Headers */}
            <ListItem containerStyle={styles.headerContainer}>
                <ListItem.Content style={{ flex: 3 }}>
                    <ListItem.Title style={styles.headerText}>Amount</ListItem.Title>
                </ListItem.Content>
                <ListItem.Content style={{ flex: 3, alignItems: "center" }}>
                    <ListItem.Title style={styles.headerText}>Date</ListItem.Title>
                </ListItem.Content>
                <ListItem.Content style={{ flex: 5, alignItems: "center" }}>
                    <ListItem.Title style={styles.headerText}>
                        Description
                    </ListItem.Title>
                </ListItem.Content>
                <ListItem.Content></ListItem.Content>
            </ListItem>
        </Card>
    )
}

export default HeaderArea

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
})
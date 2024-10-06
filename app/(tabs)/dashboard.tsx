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
  FlatList
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import React from "react";
import { ListItem, Text, Divider } from "react-native-elements";
import { Card } from "@rneui/base";
import { Colors } from "@/constants/Colors";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

interface DataRowProps {
  exp: DataType;
  isExpanded: boolean;
  toggleExpand: (id: number) => void;
}
type DataType = {
  id: number,
  amount: number,
  time: Date,
  description: string,
  type_id: number,
  tag_id: number,
  method_id: number
};

//function to format date to our liking
const formatDate = (dateString: Date) => {
  const date = new Date(dateString);
  const day = String(date.getUTCDate()).padStart(2, "0"); // Use UTC to avoid time zone shifts
  const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // UTC month
  const year = date.getUTCFullYear(); // UTC year
  return `${day}.${month}.${year}`;
};

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const DataRow: React.FC<DataRowProps> = memo(
  ({ exp, isExpanded, toggleExpand }) => {
    console.log('Rendering DataRow for: ', exp.id);
    return (
      <React.Fragment key={exp.id}>
        <ListItem
          containerStyle={styles.listItemContainer}
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
            name={isExpanded ? 'chevron-up' : 'chevron-down'}
            size={24}
            color="#E5E7EB"
          />
        </ListItem>

        {/* Expanded Content */}
        {isExpanded && (
          <View style={styles.expandedContent}>
            <Text style={styles.cellText}>Tag Id: {exp.tag_id}</Text>
            <Text style={styles.cellText}>Method Id: {exp.method_id}</Text>
            <Text style={styles.cellText}>Type Id: {exp.type_id}</Text>
          </View>
        )}
      </React.Fragment>
    );
  },
  (prevProps, nextProps) =>
    prevProps.exp === nextProps.exp && prevProps.isExpanded === nextProps.isExpanded
);

const dashboard = () => {
  const [data, setData] = useState<DataType[] | null>([]);
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
        const response = await axios.get("http://51.20.113.113:4000/data");
        setData(response.data);
      } catch (err) {
        console.error("Failed to fetch data: ", err);
      }
    };
  
    fetchData();
  }, []);

  const toggleExpand = useCallback((id: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedRow((prevExpandedRow) => (prevExpandedRow === id ? null : id));
  }, []);
  


  const keyExtractor = (exp: DataType) => exp.id.toString();

  return (
    <SafeAreaView style={styles.container}>
        <Card.Title style={styles.cardTitle}>Expense/Income</Card.Title>
        <Card containerStyle={styles.cardStyle}>
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
            <ListItem.Content>
              
            </ListItem.Content>
          </ListItem>

          </Card>

          {/* Data */}
          <FlatList
            data={data}
            keyExtractor={keyExtractor}
            renderItem={({item}) => (
              <DataRow exp={item} isExpanded={expandedRow === item.id} toggleExpand={toggleExpand} />
            )} 
            initialNumToRender={10}
            maxToRenderPerBatch={5}
            windowSize={10}
            contentContainerStyle={styles.scrollView}
            ItemSeparatorComponent={() => <Divider />}
            />
    </SafeAreaView>
  );
};

export default dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  scrollView: {
    flexGrow: 1,
    padding: 16,
  },
  view: {
    justifyContent: "center",
    alignItems: "center",
  },
  cellText: {
    fontSize: 14,
    color: "#E5E7EB",
    textAlign: "center",
    paddingVertical: 5,
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#E5E7EB",
  },
  headerContainer: {
    backgroundColor: Colors.dark.background,
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignItems: "center",
  },
  cardStyle: {
    width: "100%",
    paddingHorizontal: 0,
    backgroundColor: Colors.dark.background,
    borderWidth: 0,
  },
  listItemContainer: {
    backgroundColor: Colors.dark.background,
    borderBottomWidth: 1,
    borderColor: "#374151",
    paddingVertical: 10,
  },
  cardTitle: {
    color: "#E5E7EB",
  },
  expandedContent: {
    padding: 10,
    backgroundColor: Colors.dark.backgroundDarker,
  },
});

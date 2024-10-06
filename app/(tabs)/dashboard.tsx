import { ThemedText } from '@/components/ThemedText';
import { useEffect, useState  } from 'react';
import { StyleSheet,  View, ScrollView, Text, Dimensions, ScaledSize } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios'

type DataType = any;

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const day = String(date.getUTCDate()).padStart(2, '0'); // Use UTC to avoid time zone shifts
  const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // UTC month
  const year = date.getUTCFullYear(); // UTC year
  return `${day}.${month}.${year}`; 
};


const dashboard = () => {

  const [data, setData] = useState<DataType[] | null>([]);
  const [screenWidth, setScreenWidth] = useState<ScaledSize>(Dimensions.get('window'))
  const [expandedRow, setExpandedRow] = useState<number | null>(null)
  

  useEffect(() => {
    const handleResize = (): void => {
      setScreenWidth(Dimensions.get('window'));
    };
    const subscription = Dimensions.addEventListener('change', handleResize)
    const fetchData = async () => {
      try {

        const response = await axios.get('http://51.20.113.113:4000/data');
        setData(response.data);
        console.log(response.data)
      } catch (err){
        console.error('Failed to fetch dataa: ',err);
        
      }
    };

    fetchData();

    return () => {
      subscription?.remove()
    }

  }, []);
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.table}>
          {/* Headers */}
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.header]}>Amount</Text>
            <Text style={[styles.tableCell, styles.header]}>Date</Text>
            <Text style={[styles.tableCell, styles.header]}>Description</Text>
          </View>
        </View>
          {/* Data */}
          { data ? (
          data.map((item: any) => (
            <View key={item.id} style={styles.tableRow}>
              <Text style={styles.tableCell}>{item.amount}</Text>
              <Text style={styles.tableCell}>{formatDate(item.time)}</Text>
              <Text style={styles.tableCell}>{item.description}</Text>
            </View>
          ) )) : (
            <Text>No Data avaliable</Text>
          )}
      </ScrollView>
    </SafeAreaView>
  );
}

export default dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  view: {
    justifyContent: 'center', 
    alignItems: 'center',
  },
  table: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#000',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  tableCell:{
    flex: 1,
    padding: 10,
    textAlign: 'center',
    borderRightWidth: 1,
    borderColor: '#ccc',
    color: '#fff'
  },
  header: {
    fontWeight: 'bold',
    backgroundColor: '#f4f4f4',
    color: '#000',
  },
})
import { StyleSheet,  View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function settings() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.view}>
        <Text>Settings Page</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  view: {
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center',
  },
})
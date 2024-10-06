import { ThemedText } from '@/components/ThemedText';
import { StyleSheet,  View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function settings() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.view}>
        <ThemedText>Settings Page</ThemedText>
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
import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { ThemedText } from '@/components/ThemedText'
import { SafeAreaView } from 'react-native-safe-area-context'

const addData = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.view}>
        <ThemedText>Add Data Page</ThemedText>
      </View>
    </SafeAreaView>
  )
}

export default addData

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
import { useState } from 'react';
import { StyleSheet, View, Text, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { RulerDatePicker } from 'react-native-ruler-date-picker';

export default function App() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dateString, setDateString] = useState('');

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Ruler Date Picker</Text>
        <Text style={styles.subtitle}>Example App</Text>

        <View style={styles.pickerContainer}>
          <RulerDatePicker
            selectedDate={selectedDate}
            onSelectDate={(date, str) => {
              setSelectedDate(date);
              setDateString(str);
            }}
            showResetToToday
          />
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Selected Date:</Text>
          <Text style={styles.infoValue}>{dateString || 'Scroll the ruler'}</Text>
        </View>

        <StatusBar style="auto" />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 40,
  },
  pickerContainer: {
    width: '100%',
  },
  infoContainer: {
    marginTop: 40,
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 20,
    fontWeight: '600',
    color: '#3B82F6',
  },
});

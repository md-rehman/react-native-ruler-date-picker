// @ts-nocheck
"use client";

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { RulerDatePicker } from 'react-native-ruler-date-picker';
import styles from './ComponentPreview.module.css';

interface ComponentPreviewProps {
  props: Record<string, any>;
  updateProp: (name: string, value: any) => void;
}

export default function ComponentPreview({ props, updateProp }: ComponentPreviewProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [dateStr, setDateStr] = useState<string>('');

  useEffect(() => {
    // Initialize the property pane value on mount
    updateProp('selectedDate', selectedDate.toDateString());
  }, []);

  return (
    <div className={styles.wrapper}>
      <GestureHandlerRootView style={rnStyles.root}>
        <View style={[rnStyles.container, { backgroundColor: props.backgroundColor || 'transparent' }]}>
          
          <View style={rnStyles.header}>
            <Text style={[rnStyles.title, { color: props.labelColor }]}>
              {dateStr || 'Select a date'}
            </Text>
          </View>

          <View style={rnStyles.pickerContainer}>
            <RulerDatePicker
              {...props}
              selectedDate={selectedDate}
              onSelectDate={(date, str) => {
                setSelectedDate(date);
                setDateStr(str);
                updateProp('selectedDate', str);
              }}
            />
          </View>
          
        </View>
      </GestureHandlerRootView>
    </div>
  );
}

const rnStyles = StyleSheet.create({
  root: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  pickerContainer: {
    width: '100%',
    paddingVertical: 20,
  }
});

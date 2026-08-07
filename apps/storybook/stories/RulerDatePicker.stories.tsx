import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { View, Text, StyleSheet } from 'react-native';
import { RulerDatePicker } from 'react-native-ruler-date-picker';

const meta: Meta<typeof RulerDatePicker> = {
  title: 'Components/RulerDatePicker',
  component: RulerDatePicker,
  argTypes: {
    selectedDate: { control: 'date' },
    minDate: { control: 'date' },
    maxDate: { control: 'date' },
    labelInterval: {
      control: { type: 'select' },
      options: ['daily', 'weekly', 'monthly'],
    },
    tickSpacing: { control: { type: 'range', min: 12, max: 60, step: 2 } },
    tickHeight: { control: { type: 'range', min: 4, max: 30, step: 1 } },
    tickTallHeight: { control: { type: 'range', min: 10, max: 50, step: 2 } },
    tickThickness: { control: { type: 'range', min: 1, max: 10, step: 1 } },
    height: { control: { type: 'range', min: 80, max: 200, step: 10 } },
    rulerHeight: { control: { type: 'range', min: 30, max: 120, step: 5 } },
    indicatorWidth: { control: { type: 'range', min: 1, max: 10, step: 1 } },
    indicatorHeight: { control: { type: 'range', min: 20, max: 80, step: 5 } },
    todayDotSize: { control: { type: 'range', min: 2, max: 16, step: 1 } },
    labelFontSize: { control: { type: 'range', min: 8, max: 18, step: 1 } },
    tickColor: { control: 'color' },
    tickTallColor: { control: 'color' },
    labelColor: { control: 'color' },
    accentColor: { control: 'color' },
    indicatorColor: { control: 'color' },
    backgroundColor: { control: 'color' },
    enableHaptics: { control: 'boolean' },
    showResetToToday: { control: 'boolean' },
  },
  args: {
    selectedDate: new Date(),
    labelInterval: 'weekly',
    tickSpacing: 24,
    tickHeight: 12,
    tickTallHeight: 24,
    tickThickness: 4,
    height: 120,
    rulerHeight: 60,
    indicatorWidth: 2,
    indicatorHeight: 40,
    todayDotSize: 6,
    labelFontSize: 10,
    tickColor: '#94A3B8',
    tickTallColor: '#334155',
    labelColor: '#475569',
    accentColor: '#2563EB',
    indicatorColor: '#2563EB',
    backgroundColor: '#FFFFFF',
    enableHaptics: true,
    showResetToToday: true,
  },
};

export default meta;

type Story = StoryObj<typeof RulerDatePicker>;

export const Default: Story = {
  render: (args) => {
    const [date, setDate] = useState(
      args.selectedDate ? new Date(args.selectedDate) : new Date()
    );
    const [formattedStr, setFormattedStr] = useState('');

    return (
      <View style={styles.container}>
        <RulerDatePicker
          {...args}
          selectedDate={date}
          onSelectDate={(d, str) => {
            setDate(d);
            setFormattedStr(str);
          }}
        />
        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Selected Date:</Text>
          <Text style={styles.infoValue}>
            {formattedStr || date.toISOString().split('T')[0]}
          </Text>
        </View>
      </View>
    );
  },
};

export const DarkEmeraldTheme: Story = {
  args: {
    backgroundColor: '#022C22',
    tickColor: '#064E3B',
    tickTallColor: '#10B981',
    accentColor: '#34D399',
    indicatorColor: '#34D399',
    labelColor: '#6EE7B7',
  },
};

export const RoseSunsetTheme: Story = {
  args: {
    backgroundColor: '#FFF1F2',
    tickColor: '#FECDD3',
    tickTallColor: '#F43F5E',
    accentColor: '#E11D48',
    indicatorColor: '#BE123C',
    labelColor: '#9F1239',
  },
};

export const DailyIntervals: Story = {
  args: {
    labelInterval: 'daily',
    tickSpacing: 36,
  },
};

export const CustomLayout: Story = {
  args: {
    height: 150,
    rulerHeight: 80,
    tickSpacing: 32,
    tickThickness: 6,
    tickHeight: 16,
    tickTallHeight: 36,
    indicatorWidth: 4,
    indicatorHeight: 50,
  },
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
  },
  infoBox: {
    marginTop: 20,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 16,
    color: '#0F172A',
    fontWeight: '700',
    marginTop: 4,
  },
});

import React from 'react';
import { View, Text, StyleSheet, type StyleProp, type ViewStyle, type TextStyle } from 'react-native';
import { useRulerContext } from './RulerContext';
import { RulerResetButton } from './RulerResetButton';

export interface RulerHeaderProps {
  style?: StyleProp<ViewStyle>;
  dateStyle?: StyleProp<TextStyle>;
  yearStyle?: StyleProp<TextStyle>;
  showResetToToday?: boolean;
  render?: (
    selectedDate: Date,
    isToday: boolean,
    resetToToday: () => void
  ) => React.ReactNode;
}

export function RulerHeader({
  style,
  dateStyle,
  yearStyle,
  showResetToToday = false,
  render,
}: RulerHeaderProps = {}) {
  const { selectedDate, isTodaySelected, resetToToday, theme } =
    useRulerContext();

  if (render) {
    return <>{render(selectedDate, isTodaySelected, resetToToday)}</>;
  }

  const displayFormat = selectedDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
  const displayYear = selectedDate.getFullYear();
  const currentYear = new Date().getFullYear();
  const showYear = displayYear !== currentYear;

  return (
    <View style={[styles.headerContainer, style]}>
      <View style={styles.dateHeader}>
        {showYear && (
          <Text style={[styles.yearText, { color: theme.labelColor }, yearStyle]}>
            {displayYear}
          </Text>
        )}
        <Text
          style={[
            styles.dateText,
            { color: theme.accentColor },
            dateStyle,
          ]}
        >
          {displayFormat}
        </Text>
      </View>

      {showResetToToday && !isTodaySelected && (
        <RulerResetButton style={styles.resetBtnPosition} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 16,
    height: 40,
    position: 'relative',
  },
  dateHeader: {
    alignItems: 'center',
  },
  yearText: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 2,
  },
  dateText: {
    fontSize: 18,
    fontWeight: '600',
  },
  resetBtnPosition: {
    position: 'absolute',
    right: 20,
  },
});

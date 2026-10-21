import React from 'react';
import { View, Text, StyleSheet, type StyleProp, type ViewStyle, type TextStyle } from 'react-native';
import { useRulerContext } from './RulerContext';
import { RulerResetButton } from './RulerResetButton';

export interface RulerHeaderProps {
  style?: StyleProp<ViewStyle>;
  dateStyle?: StyleProp<TextStyle>;
  yearStyle?: StyleProp<TextStyle>;
  showResetToToday?: boolean;
  format?: (date: Date) => string;
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
  showResetToToday: customShowReset,
  format: customFormat,
  render,
}: RulerHeaderProps = {}) {
  const {
    selectedDate,
    isTodaySelected,
    resetToToday,
    theme,
    headerConfig,
    locale = 'default',
  } = useRulerContext();

  const customRenderer = render ?? headerConfig?.render;
  if (customRenderer) {
    return <>{customRenderer(selectedDate, isTodaySelected, resetToToday)}</>;
  }

  const showReset = customShowReset ?? headerConfig?.showResetToToday ?? false;
  const formatFn = customFormat ?? headerConfig?.format;

  const displayFormat = formatFn
    ? formatFn(selectedDate)
    : selectedDate.toLocaleDateString(locale, {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      });
  const displayYear = selectedDate.getFullYear();
  const currentYear = new Date().getFullYear();
  const showYear = !formatFn && displayYear !== currentYear;

  const headerStyle = style ?? headerConfig?.style;
  const resolvedDateStyle = dateStyle ?? headerConfig?.dateStyle;
  const resolvedYearStyle = yearStyle ?? headerConfig?.yearStyle;

  return (
    <View style={[styles.headerContainer, headerStyle]}>
      <View style={styles.dateHeader}>
        {showYear && (
          <Text style={[styles.yearText, { color: theme.labelColor }, resolvedYearStyle]}>
            {displayYear}
          </Text>
        )}
        <Text
          style={[
            styles.dateText,
            { color: theme.accentColor },
            resolvedDateStyle,
          ]}
        >
          {displayFormat}
        </Text>
      </View>

      {showReset && !isTodaySelected && (
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

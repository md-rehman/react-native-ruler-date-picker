import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
  type TextStyle,
} from 'react-native';
import { useRulerRangeContext } from './RulerRangeContext';
import type { RangeHeaderContext } from './types';

export interface RulerRangeHeaderProps {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  dateStyle?: StyleProp<TextStyle>;
  format?: (date: Date) => string;
  render?: (context: RangeHeaderContext) => React.ReactNode;
}

export function RulerRangeHeader({
  children,
  style,
  dateStyle,
  format: customFormat,
  render,
}: RulerRangeHeaderProps = {}) {
  const {
    startDate,
    endDate,
    spanDays,
    activeHandle,
    scrollToHandle,
    theme,
    headerConfig,
    locale = 'default',
  } = useRulerRangeContext();

  const headerStyle = style ?? headerConfig?.style;

  if (children) {
    return <View style={[styles.headerContainer, headerStyle]}>{children}</View>;
  }

  const customRenderer = render ?? headerConfig?.render;
  if (customRenderer) {
    return (
      <>
        {customRenderer({
          start: startDate,
          end: endDate,
          spanDays,
          activeHandle,
          scrollToHandle,
        })}
      </>
    );
  }

  const formatFn = customFormat ?? headerConfig?.format;

  const startFormatted = formatFn
    ? formatFn(startDate)
    : startDate.toLocaleDateString(locale, {
        month: 'short',
        day: 'numeric',
      });
  const endFormatted = formatFn
    ? formatFn(endDate)
    : endDate.toLocaleDateString(locale, {
        month: 'short',
        day: 'numeric',
      });

  const resolvedDateStyle = dateStyle ?? headerConfig?.dateStyle;

  return (
    <View style={[styles.headerContainer, headerStyle]}>
      {/* Start Date Button */}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => scrollToHandle('start', true)}
        style={[
          styles.pill,
          activeHandle === 'start' && {
            borderColor: theme.accentColor,
            backgroundColor: `${theme.accentColor}15`,
          },
        ]}
      >
        <Text style={[styles.subLabel, { color: theme.labelColor }]}>START</Text>
        <Text
          style={[
            styles.dateLabel,
            { color: activeHandle === 'start' ? theme.accentColor : theme.labelColor },
            resolvedDateStyle,
          ]}
        >
          {startFormatted}
        </Text>
      </TouchableOpacity>

      {/* Arrow & Span Indicator */}
      <View style={styles.arrowContainer}>
        <Text style={[styles.arrowText, { color: theme.labelColor }]}>➔</Text>
        <Text style={[styles.spanText, { color: theme.accentColor }]}>
          {spanDays} {spanDays === 1 ? 'day' : 'days'}
        </Text>
      </View>

      {/* End Date Button */}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => scrollToHandle('end', true)}
        style={[
          styles.pill,
          activeHandle === 'end' && {
            borderColor: theme.accentColor,
            backgroundColor: `${theme.accentColor}15`,
          },
        ]}
      >
        <Text style={[styles.subLabel, { color: theme.labelColor }]}>END</Text>
        <Text
          style={[
            styles.dateLabel,
            { color: activeHandle === 'end' ? theme.accentColor : theme.labelColor },
            resolvedDateStyle,
          ]}
        >
          {endFormatted}
        </Text>
      </TouchableOpacity>
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
    minHeight: 48,
  },
  pill: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'transparent',
    alignItems: 'center',
  },
  subLabel: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  dateLabel: {
    fontSize: 14,
    fontWeight: '700',
  },
  arrowContainer: {
    marginHorizontal: 12,
    alignItems: 'center',
  },
  arrowText: {
    fontSize: 12,
    fontWeight: '600',
  },
  spanText: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
  },
});

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { ResolvedColors } from './types';

export interface TickProps {
  offset: number;
  isLabeled: boolean;
  isToday: boolean;
  isHighlighted: boolean;
  dateStr: string;
  tickSpacing: number;
  tickHeight: number;
  tickTallHeight: number;
  tickThickness: number;
  tickColor: string;
  tickTallColor: string;
  labelColor: string;
  accentColor: string;
  todayDotSize: number;
  labelFontSize: number;
  rulerHeight: number;
}

/**
 * Memoized single tick component.
 * Renders a vertical bar with optional label and today dot indicator.
 * Small and large ticks can be independently colored.
 */
export const Tick = React.memo(function Tick({
  offset,
  isLabeled,
  isToday,
  dateStr,
  tickSpacing,
  tickHeight,
  tickTallHeight,
  tickThickness,
  tickColor,
  tickTallColor,
  labelColor,
  accentColor,
  todayDotSize,
  labelFontSize,
  rulerHeight,
}: TickProps) {
  const resolvedTickColor = isLabeled ? tickTallColor : tickColor;
  const resolvedTickHeight = isLabeled ? tickTallHeight : tickHeight;

  return (
    <View
      style={[
        styles.tickContainer,
        {
          width: tickSpacing,
          height: rulerHeight,
          position: 'absolute',
          left: offset * tickSpacing - tickSpacing / 2,
        },
      ]}
    >
      {isLabeled && (
        <Text style={[styles.tickLabel, { color: labelColor, fontSize: labelFontSize }]}>
          {dateStr}
        </Text>
      )}
      {isToday && (
        <View
          style={[
            styles.todayDot,
            {
              backgroundColor: accentColor,
              width: todayDotSize,
              height: todayDotSize,
              borderRadius: todayDotSize / 2,
            },
          ]}
        />
      )}
      <View
        style={{
          backgroundColor: resolvedTickColor,
          width: tickThickness,
          height: resolvedTickHeight,
          borderRadius: tickThickness / 2,
        }}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  tickContainer: {
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  tickLabel: {
    position: 'absolute',
    top: 10,
  },
  todayDot: {
    position: 'absolute',
    top: 25,
  },
});

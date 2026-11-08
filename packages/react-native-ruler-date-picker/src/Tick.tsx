import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { ResolvedTick } from './types';

export interface TickProps {
  tick: ResolvedTick;
  tickSpacing: number;
  rulerHeight: number;
}

/**
 * Memoized single tick component.
 * Renders a vertical tick bar with optional label, dot indicator, or custom render element.
 */
export const Tick = React.memo(function Tick({
  tick,
  tickSpacing,
  rulerHeight,
}: TickProps) {
  if (tick.customRender) {
    return (
      <View
        style={[
          styles.tickContainer,
          {
            width: tickSpacing,
            height: rulerHeight,
            position: 'absolute',
            left: tick.offset * tickSpacing - tickSpacing / 2,
          },
        ]}
      >
        {tick.customRender({
          date: tick.date,
          offset: tick.offset,
          isToday: tick.isToday,
          isSelected: tick.isSelected,
          isInRange: tick.isInRange,
        })}
      </View>
    );
  }

  return (
    <View
      style={[
        styles.tickContainer,
        {
          width: tickSpacing,
          height: rulerHeight,
          position: 'absolute',
          left: tick.offset * tickSpacing - tickSpacing / 2,
        },
      ]}
    >
      {/* Label */}
      {tick.labelText !== undefined && (
        <Text
          numberOfLines={1}
          style={[
            styles.tickLabel,
            {
              color: tick.labelColor,
              fontSize: tick.labelFontSize,
              fontWeight: tick.labelFontWeight,
            },
          ]}
        >
          {tick.labelText}
        </Text>
      )}

      {/* Dot Badge */}
      {tick.hasDot && (
        <View
          style={[
            styles.dot,
            {
              backgroundColor: tick.dotColor,
              width: tick.dotSize,
              height: tick.dotSize,
              borderRadius: tick.dotSize / 2,
              bottom: tick.height + 4,
            },
          ]}
        />
      )}

      {/* Bar */}
      <View
        style={{
          backgroundColor: tick.color,
          width: tick.width,
          height: tick.height,
          borderRadius: tick.width / 2,
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
    top: 6,
    textAlign: 'center',
  },
  dot: {
    position: 'absolute',
  },
});

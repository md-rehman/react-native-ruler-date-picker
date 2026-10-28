import React from 'react';
import { View, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { useRulerRangeContext } from './RulerRangeContext';
import { DEFAULTS } from './defaults';

export interface RulerRangeIndicatorProps {
  width?: number;
  height?: number;
  color?: string;
  /**
   * Offset [x, y] in pixels of the range handle needle.
   * Default: [0, 0] (anchored to bottom).
   */
  offset?: [number, number];
  style?: StyleProp<ViewStyle>;
  render?: (handle: 'start' | 'end', date: Date) => React.ReactNode;
}

export function RulerRangeIndicator({
  width: customWidth,
  height: customHeight,
  color: customColor,
  offset: customOffset,
  style,
  render,
}: RulerRangeIndicatorProps = {}) {
  const { indicatorConfig, theme, activeHandle, startDate, endDate } = useRulerRangeContext();

  const activeDate = activeHandle === 'start' ? startDate : endDate;
  const customRenderer = render ?? indicatorConfig?.render;
  if (customRenderer) {
    return <>{customRenderer(activeHandle, activeDate)}</>;
  }

  const width = customWidth ?? indicatorConfig?.width ?? DEFAULTS.indicatorWidth;
  const height = customHeight ?? indicatorConfig?.height ?? DEFAULTS.indicatorHeight;
  const color = customColor ?? indicatorConfig?.color ?? theme.indicatorColor;
  const offset = customOffset ?? indicatorConfig?.offset ?? [0, 0];
  const indicatorStyle = style ?? indicatorConfig?.style;

  const [offsetX = 0, offsetY = 0] = offset;

  return (
    <View
      pointerEvents="none"
      style={[
        styles.indicator,
        {
          bottom: offsetY,
          transform: [{ translateX: offsetX }],
          width,
          height,
          backgroundColor: color,
          borderRadius: width / 2,
        },
        indicatorStyle,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  indicator: {
    position: 'absolute',
    zIndex: 10,
  },
});

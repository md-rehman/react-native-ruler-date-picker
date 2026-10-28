import React from 'react';
import { View, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { useRulerContext } from './RulerContext';
import { DEFAULTS } from './defaults';

export interface RulerIndicatorProps {
  width?: number;
  height?: number;
  color?: string;
  /**
   * Offset [x, y] in pixels of the center needle pointer.
   * Default: [0, 0] (anchored to bottom).
   */
  offset?: [number, number];
  style?: StyleProp<ViewStyle>;
  render?: () => React.ReactNode;
}

export function RulerIndicator({
  width: customWidth,
  height: customHeight,
  color: customColor,
  offset: customOffset,
  style,
  render,
}: RulerIndicatorProps = {}) {
  const { indicatorConfig, theme } = useRulerContext();

  const customRenderer = render ?? indicatorConfig?.render;
  if (customRenderer) {
    return <>{customRenderer()}</>;
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

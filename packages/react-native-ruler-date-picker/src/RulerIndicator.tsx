import React from 'react';
import { View, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { useRulerContext } from './RulerContext';
import { DEFAULTS } from './defaults';

export interface RulerIndicatorProps {
  width?: number;
  height?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
  render?: () => React.ReactNode;
}

export function RulerIndicator({
  width: customWidth,
  height: customHeight,
  color: customColor,
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
  const indicatorStyle = style ?? indicatorConfig?.style;

  return (
    <View
      pointerEvents="none"
      style={[
        styles.indicator,
        {
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
    bottom: 0,
  },
});

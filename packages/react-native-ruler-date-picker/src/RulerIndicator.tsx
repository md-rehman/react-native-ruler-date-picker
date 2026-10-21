import React from 'react';
import { View, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { useRulerContext } from './RulerContext';
import { DEFAULTS } from './defaults';

export interface RulerIndicatorProps {
  width?: number;
  height?: number;
  color?: string;
  alignment?: 'bottom' | 'center' | 'top';
  style?: StyleProp<ViewStyle>;
  render?: () => React.ReactNode;
}

export function RulerIndicator({
  width: customWidth,
  height: customHeight,
  color: customColor,
  alignment: customAlignment,
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
  const alignment = customAlignment ?? indicatorConfig?.alignment ?? 'bottom';
  const indicatorStyle = style ?? indicatorConfig?.style;

  const alignmentStyle: ViewStyle =
    alignment === 'top'
      ? { top: 0 }
      : alignment === 'center'
      ? { top: '50%', transform: [{ translateY: -height / 2 }] }
      : { bottom: 0 };

  return (
    <View
      pointerEvents="none"
      style={[
        styles.indicator,
        alignmentStyle,
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
  },
});

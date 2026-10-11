import React from 'react';
import { View, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { useRulerContext } from './RulerContext';

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
  const {
    indicatorWidth = 2,
    indicatorHeight = 40,
    indicatorColor: contextColor,
    theme,
    renderIndicator: contextRender,
  } = useRulerContext();

  const customRenderer = render ?? contextRender;
  if (customRenderer) {
    return <>{customRenderer()}</>;
  }

  const width = customWidth ?? indicatorWidth;
  const height = customHeight ?? indicatorHeight;
  const color = customColor ?? contextColor ?? theme.indicatorColor;

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
        style,
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

import React from 'react';
import { View, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { useRulerRangeContext } from './RulerRangeContext';

export interface RulerRangeHighlightProps {
  style?: StyleProp<ViewStyle>;
  color?: string;
}

export function RulerRangeHighlight({ style, color }: RulerRangeHighlightProps = {}) {
  const { startOffset, endOffset, tickSpacing, rulerHeight, theme, rangeHighlightColor: propColor } =
    useRulerRangeContext();

  const highlightColor = color ?? propColor ?? theme.rangeHighlightColor;
  const left = startOffset * tickSpacing - tickSpacing / 2;
  const width = Math.max(tickSpacing, (endOffset - startOffset + 1) * tickSpacing);

  return (
    <View
      pointerEvents="none"
      style={[
        styles.highlight,
        {
          left,
          width,
          height: rulerHeight,
          backgroundColor: highlightColor,
        },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  highlight: {
    position: 'absolute',
    bottom: 0,
    borderRadius: 8,
    zIndex: 1,
  },
});

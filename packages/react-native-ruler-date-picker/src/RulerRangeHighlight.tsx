import React from 'react';
import { View, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { useRulerRangeContext } from './RulerRangeContext';

export interface RulerRangeHighlightProps {
  style?: StyleProp<ViewStyle>;
  color?: string;
}

export function RulerRangeHighlight({ style, color }: RulerRangeHighlightProps = {}) {
  const { startOffset, endOffset, tickSpacing, rulerHeight, theme, highlightConfig } =
    useRulerRangeContext();

  if (highlightConfig?.render) {
    return <>{highlightConfig.render(startOffset, endOffset, tickSpacing)}</>;
  }

  const highlightColor = color ?? highlightConfig?.color ?? theme.rangeHighlightColor;
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
        highlightConfig?.style,
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

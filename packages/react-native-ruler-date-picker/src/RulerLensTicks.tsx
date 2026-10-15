import React from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useRulerContext } from './RulerContext';
import { LensTick } from './LensTick';
import { DEFAULT_LENS_CONFIG } from './defaults';
import type { LensConfig } from './types';

export interface RulerLensTicksProps {
  style?: StyleProp<ViewStyle>;
  config?: LensConfig;
}

/**
 * Ticks container rendering ticks with dynamic non-linear fisheye lens spacing.
 */
export function RulerLensTicks({ style, config: propConfig }: RulerLensTicksProps = {}) {
  const { translateX, visibleTicks, tickSpacing, rulerHeight, lensConfig: contextConfig } =
    useRulerContext();

  const config = propConfig
    ? { ...DEFAULT_LENS_CONFIG, ...propConfig }
    : contextConfig ?? DEFAULT_LENS_CONFIG;

  return (
    <View pointerEvents="none" style={[styles.ticksContainer, style]}>
      {visibleTicks.map((tick) => (
        <LensTick
          key={tick.offset}
          tick={tick}
          tickSpacing={tickSpacing}
          rulerHeight={rulerHeight}
          translateX={translateX}
          magnification={config.magnification}
          radius={config.radius}
          scaleTicks={config.scaleTicks}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  ticksContainer: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    left: 0,
    top: 0,
  },
});

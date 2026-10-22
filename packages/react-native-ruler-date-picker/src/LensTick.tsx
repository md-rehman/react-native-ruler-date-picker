import React from 'react';
import { StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, type SharedValue } from 'react-native-reanimated';
import { useRulerContext } from './RulerContext';
import { Tick } from './Tick';
import type { ResolvedTick } from './types';

export interface LensTickProps {
  tick: ResolvedTick;
  tickSpacing: number;
  rulerHeight: number;
  translateX: SharedValue<number>;
  magnification: number;
  radius: number;
  scaleTicks: boolean;
  containerWidth?: number;
}

/**
 * Animated tick item with non-linear hyperbolic-tangent spatial distortion.
 * Tick spacing smoothly magnifies near the center needle and asymptotically
 * flattens out to standard spacing away from the center.
 */
export function LensTick({
  tick,
  tickSpacing,
  rulerHeight,
  translateX,
  magnification,
  radius,
  scaleTicks,
  containerWidth,
}: LensTickProps) {
  const { width: contextWidth } = useRulerContext();
  const width = containerWidth ?? contextWidth;

  const animatedStyle = useAnimatedStyle(() => {
    'worklet';
    const d = tick.offset * tickSpacing + translateX.value;
    const A = (magnification - 1) * radius;
    const warpedX = d + A * Math.tanh(d / radius);

    if (!scaleTicks) {
      return {
        transform: [{ translateX: warpedX }],
      };
    }

    const dist = Math.abs(d);
    const radiusLimit = radius * 1.5;
    const factor = dist < radiusLimit ? 1 - dist / radiusLimit : 0;
    const scale = 1 + (magnification - 1) * 0.25 * factor;

    return {
      transform: [
        { translateX: warpedX },
        { scale: scale },
      ],
    };
  }, [tick.offset, tickSpacing, translateX, magnification, radius, scaleTicks]);

  return (
    <Animated.View
      style={[
        styles.lensTickWrapper,
        { height: rulerHeight, left: width / 2 },
        animatedStyle,
      ]}
    >
      <Tick
        tick={{
          ...tick,
          offset: 0,
        }}
        tickSpacing={tickSpacing}
        rulerHeight={rulerHeight}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  lensTickWrapper: {
    position: 'absolute',
    height: '100%',
    width: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});

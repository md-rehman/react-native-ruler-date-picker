import React from 'react';
import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { useRulerContext } from './RulerContext';
import { Tick } from './Tick';
import type { ResolvedTick } from './types';

export interface RulerTicksProps {
  style?: StyleProp<ViewStyle>;
  renderTick?: (tick: ResolvedTick, tickSpacing: number, rulerHeight: number) => React.ReactNode;
}

export function RulerTicks({ style, renderTick }: RulerTicksProps = {}) {
  const { translateX, visibleTicks, tickSpacing, rulerHeight, width } =
    useRulerContext();

  const animatedStyle = useAnimatedStyle(
    () => ({
      transform: [{ translateX: translateX.value }],
    }),
    [translateX]
  );

  return (
    <Animated.View
      style={[
        styles.ticksWrapper,
        { left: width / 2 },
        animatedStyle,
        style,
      ]}
    >
      {visibleTicks.map((tick) =>
        renderTick ? (
          renderTick(tick, tickSpacing, rulerHeight)
        ) : (
          <Tick
            key={tick.offset}
            tick={tick}
            tickSpacing={tickSpacing}
            rulerHeight={rulerHeight}
          />
        )
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  ticksWrapper: {
    position: 'absolute',
    height: '100%',
    width: 0,
  },
});

import React from 'react';
import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { useRulerRangeContext } from './RulerRangeContext';
import { RulerRangeHighlight } from './RulerRangeHighlight';
import { Tick } from './Tick';
import type { ResolvedTick } from './types';

export interface RulerRangeTicksProps {
  style?: StyleProp<ViewStyle>;
  renderTick?: (tick: ResolvedTick, tickSpacing: number, rulerHeight: number) => React.ReactNode;
  showHighlight?: boolean;
}

/**
 * Animated ticks container for the date range picker with Reanimated transform
 * and connected highlight span.
 */
export function RulerRangeTicks({
  style,
  renderTick,
  showHighlight = true,
}: RulerRangeTicksProps = {}) {
  const { translateX, visibleTicks, tickSpacing, rulerHeight, width } =
    useRulerRangeContext();

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
      {showHighlight && <RulerRangeHighlight />}
      {visibleTicks.map((tick) =>
        renderTick ? (
          <React.Fragment key={tick.offset}>
            {renderTick(tick, tickSpacing, rulerHeight)}
          </React.Fragment>
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

import React from 'react';
import { View, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { GestureDetector } from 'react-native-gesture-handler';
import { useRulerRangeContext } from './RulerRangeContext';
import { RulerRangeHighlight } from './RulerRangeHighlight';
import { RulerRangeIndicator } from './RulerRangeIndicator';
import { Tick } from './Tick';

export interface RulerRangeTrackProps {
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

export function RulerRangeTrack({ style, children }: RulerRangeTrackProps = {}) {
  const {
    panGesture,
    translateX,
    visibleTicks,
    tickSpacing,
    rulerHeight,
    width,
  } = useRulerRangeContext();

  const animatedStyle = useAnimatedStyle(
    () => ({
      transform: [{ translateX: translateX.value }],
    }),
    [translateX]
  );

  return (
    <GestureDetector gesture={panGesture}>
      <View style={[styles.rulerContainer, { width, height: rulerHeight }, style]}>
        {/* Center Indicator pointing at active handle */}
        <RulerRangeIndicator />

        <Animated.View style={[styles.ticksWrapper, { left: width / 2 }, animatedStyle]}>
          {/* Highlight Span */}
          <RulerRangeHighlight />

          {/* Ticks */}
          {visibleTicks.map((tick) => (
            <Tick
              key={tick.offset}
              tick={tick}
              tickSpacing={tickSpacing}
              rulerHeight={rulerHeight}
            />
          ))}

          {children}
        </Animated.View>
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  rulerContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  ticksWrapper: {
    position: 'absolute',
    height: '100%',
    width: 0,
  },
});

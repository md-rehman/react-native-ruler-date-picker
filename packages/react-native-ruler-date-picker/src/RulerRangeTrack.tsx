import React from 'react';
import { View, StyleSheet, Dimensions, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { GestureDetector } from 'react-native-gesture-handler';
import { useRulerRangeContext } from './RulerRangeContext';
import { RulerRangeHighlight } from './RulerRangeHighlight';
import { Tick } from './Tick';

const SCREEN_WIDTH = Dimensions.get('window').width;

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
    indicatorWidth = 2,
    indicatorHeight = 40,
    indicatorColor,
    theme,
  } = useRulerRangeContext();

  const animatedStyle = useAnimatedStyle(
    () => ({
      transform: [{ translateX: translateX.value }],
    }),
    [translateX]
  );

  return (
    <GestureDetector gesture={panGesture}>
      <View style={[styles.rulerContainer, { height: rulerHeight }, style]}>
        {/* Center Indicator pointing at active handle */}
        <View
          pointerEvents="none"
          style={[
            styles.indicator,
            {
              width: indicatorWidth,
              height: indicatorHeight,
              backgroundColor: indicatorColor ?? theme.indicatorColor,
              borderRadius: indicatorWidth / 2,
            },
          ]}
        />

        <Animated.View style={[styles.ticksWrapper, animatedStyle]}>
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
    width: SCREEN_WIDTH,
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  indicator: {
    position: 'absolute',
    zIndex: 10,
    bottom: 0,
  },
  ticksWrapper: {
    position: 'absolute',
    height: '100%',
    width: 0,
    left: SCREEN_WIDTH / 2,
  },
});

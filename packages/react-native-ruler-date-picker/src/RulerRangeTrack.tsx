import React from 'react';
import { View, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import { useRulerRangeContext } from './RulerRangeContext';
import { RulerRangeIndicator } from './RulerRangeIndicator';
import { RulerRangeTicks } from './RulerRangeTicks';

export interface RulerRangeTrackProps {
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

export function RulerRangeTrack({ style, children }: RulerRangeTrackProps = {}) {
  const { panGesture, rulerHeight, width } = useRulerRangeContext();

  return (
    <GestureDetector gesture={panGesture}>
      <View style={[styles.rulerContainer, { width, height: rulerHeight }, style]}>
        {children ?? (
          <>
            <RulerRangeIndicator />
            <RulerRangeTicks />
          </>
        )}
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
});


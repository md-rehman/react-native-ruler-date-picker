import React from 'react';
import { View, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import { useRulerContext } from './RulerContext';

export interface RulerTrackProps {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function RulerTrack({ children, style }: RulerTrackProps) {
  const { panGesture, rulerHeight, width } = useRulerContext();

  return (
    <GestureDetector gesture={panGesture}>
      <View style={[styles.rulerContainer, { width, height: rulerHeight }, style]}>
        {children}
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
  },
});

import React from 'react';
import { View, StyleSheet, Dimensions, type StyleProp, type ViewStyle } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import { useRulerContext } from './RulerContext';

const SCREEN_WIDTH = Dimensions.get('window').width;

export interface RulerTrackProps {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function RulerTrack({ children, style }: RulerTrackProps) {
  const { panGesture, rulerHeight } = useRulerContext();

  return (
    <GestureDetector gesture={panGesture}>
      <View style={[styles.rulerContainer, { height: rulerHeight }, style]}>
        {children}
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
});

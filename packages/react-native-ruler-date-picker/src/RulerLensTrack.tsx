import React from 'react';
import { View, StyleSheet, Dimensions, type StyleProp, type ViewStyle } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import { useRulerContext } from './RulerContext';
import { RulerIndicator } from './RulerIndicator';
import { RulerLensTicks } from './RulerLensTicks';
import type { LensConfig } from './types';

const SCREEN_WIDTH = Dimensions.get('window').width;

export interface RulerLensTrackProps {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  config?: LensConfig;
}

/**
 * Horizontal ruler track with pan gesture detection and non-linear fisheye lens distortion.
 */
export function RulerLensTrack({ children, style, config }: RulerLensTrackProps = {}) {
  const { panGesture, rulerHeight } = useRulerContext();

  return (
    <GestureDetector gesture={panGesture}>
      <View style={[styles.rulerContainer, { height: rulerHeight }, style]}>
        {children ? (
          children
        ) : (
          <>
            <RulerIndicator />
            <RulerLensTicks config={config} />
          </>
        )}
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

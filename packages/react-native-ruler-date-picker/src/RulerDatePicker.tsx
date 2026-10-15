import React from 'react';
import type { RulerDatePickerProps } from './types';
import { DEFAULTS } from './defaults';
import { RulerRoot } from './RulerRoot';
import { RulerHeader } from './RulerHeader';
import { RulerTrack } from './RulerTrack';
import { RulerIndicator } from './RulerIndicator';
import { RulerTicks } from './RulerTicks';
import { RulerLensTrack } from './RulerLensTrack';

/**
 * A performant, customizable horizontal ruler date picker for React Native & Expo.
 *
 * Features:
 * - 60 FPS scrolling via Reanimated 3 decay physics & snap alignment
 * - Generic, unopinionated Rule-Based Tick System (`TickRule[]`)
 * - Windowed tick rendering for high memory efficiency
 * - Dual-speed haptic feedback (discrete ticks vs continuous buzz)
 * - Non-linear fisheye lens distortion (`lensEffect`)
 * - Automatic Dark/Light mode theme detection
 *
 * @example
 * ```tsx
 * <RulerDatePicker
 *   value={selectedDate}
 *   onChange={(date, dateString) => console.log(dateString)}
 *   lensEffect
 * />
 * ```
 */
export function RulerDatePicker(props: RulerDatePickerProps) {
  const {
    showHeader = DEFAULTS.showHeader,
    showResetToToday = DEFAULTS.showResetToToday,
    renderHeader,
    indicatorWidth = DEFAULTS.indicatorWidth,
    indicatorHeight = DEFAULTS.indicatorHeight,
    indicatorColor,
    renderIndicator,
    lensEffect,
    ...rootProps
  } = props;

  return (
    <RulerRoot
      {...rootProps}
      lensEffect={lensEffect}
      indicatorWidth={indicatorWidth}
      indicatorHeight={indicatorHeight}
      indicatorColor={indicatorColor}
      renderIndicator={renderIndicator}
    >
      {showHeader && (
        <RulerHeader
          showResetToToday={showResetToToday}
          render={renderHeader}
        />
      )}
      {lensEffect ? (
        <RulerLensTrack />
      ) : (
        <RulerTrack>
          <RulerIndicator />
          <RulerTicks />
        </RulerTrack>
      )}
    </RulerRoot>
  );
}

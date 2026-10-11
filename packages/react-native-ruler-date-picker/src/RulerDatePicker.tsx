import React from 'react';
import type { RulerDatePickerProps } from './types';
import { DEFAULTS } from './defaults';
import { RulerRoot } from './RulerRoot';
import { RulerHeader } from './RulerHeader';
import { RulerTrack } from './RulerTrack';
import { RulerIndicator } from './RulerIndicator';
import { RulerTicks } from './RulerTicks';

/**
 * A performant, customizable horizontal ruler date picker for React Native & Expo.
 *
 * Features:
 * - 60 FPS scrolling via Reanimated 3 decay physics & snap alignment
 * - Generic, unopinionated Rule-Based Tick System (`TickRule[]`)
 * - Windowed tick rendering for high memory efficiency
 * - Dual-speed haptic feedback (discrete ticks vs continuous buzz)
 * - Automatic Dark/Light mode theme detection
 *
 * @example
 * ```tsx
 * <RulerDatePicker
 *   value={selectedDate}
 *   onChange={(date, dateString) => console.log(dateString)}
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
    ...rootProps
  } = props;

  return (
    <RulerRoot
      {...rootProps}
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
      <RulerTrack>
        <RulerIndicator />
        <RulerTicks />
      </RulerTrack>
    </RulerRoot>
  );
}

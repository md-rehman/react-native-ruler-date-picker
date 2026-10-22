import React from 'react';
import type { RulerDatePickerProps } from './types';
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
    header = true,
    indicator = true,
    lensEffect,
    ...rootProps
  } = props;

  // Resolve Header
  const isHeaderVisible = header !== false;
  const headerConfig = typeof header === 'object' ? header : undefined;

  // Resolve Indicator
  const isIndicatorVisible = indicator !== false;
  const indicatorConfig = typeof indicator === 'object' ? indicator : undefined;

  return (
    <RulerRoot
      {...rootProps}
      header={header}
      lensEffect={lensEffect}
      indicator={indicatorConfig}
    >
      {isHeaderVisible && <RulerHeader {...headerConfig} />}
      {lensEffect ? (
        <RulerLensTrack />
      ) : (
        <RulerTrack>
          {isIndicatorVisible && <RulerIndicator />}
          <RulerTicks />
        </RulerTrack>
      )}
    </RulerRoot>
  );
}

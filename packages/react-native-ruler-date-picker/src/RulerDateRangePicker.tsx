import React from 'react';
import type { RulerDateRangePickerProps } from './types';
import { RulerRangeRoot } from './RulerRangeRoot';
import { RulerRangeHeader } from './RulerRangeHeader';
import { RulerRangeTrack } from './RulerRangeTrack';
import { DEFAULTS } from './defaults';

/**
 * A performant horizontal ruler date range picker for React Native & Expo.
 *
 * Features:
 * - Select date ranges (startDate to endDate) with dual-point feedback
 * - Range highlight strip spanning across selected days
 * - Reanimated 3 physics and snap alignment
 * - Rule-Based tick system and haptics
 *
 * @example
 * ```tsx
 * <RulerDateRangePicker
 *   value={{ start: new Date(), end: new Date(Date.now() + 7 * 86400000) }}
 *   onChange={({ startDate, endDate }) => console.log(startDate, endDate)}
 * />
 * ```
 */
export function RulerDateRangePicker(props: RulerDateRangePickerProps) {
  const {
    showHeader = DEFAULTS.showHeader,
    indicatorWidth = DEFAULTS.indicatorWidth,
    indicatorHeight = DEFAULTS.indicatorHeight,
    indicatorColor,
    rangeHighlightColor,
    ...rootProps
  } = props;

  return (
    <RulerRangeRoot
      {...rootProps}
      indicatorWidth={indicatorWidth}
      indicatorHeight={indicatorHeight}
      indicatorColor={indicatorColor}
      rangeHighlightColor={rangeHighlightColor}
    >
      {showHeader && <RulerRangeHeader />}
      <RulerRangeTrack />
    </RulerRangeRoot>
  );
}

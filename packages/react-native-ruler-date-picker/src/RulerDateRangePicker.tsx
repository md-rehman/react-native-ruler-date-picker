import React from 'react';
import type { RulerDateRangePickerProps } from './types';
import { RulerRangeRoot } from './RulerRangeRoot';
import { RulerRangeHeader } from './RulerRangeHeader';
import { RulerRangeTrack } from './RulerRangeTrack';

/**
 * A performant, customizable horizontal ruler date range picker for React Native & Expo.
 *
 * Features:
 * - Dual-handle windowed date range selection with connecting highlight strip
 * - Active handle auto-switching (tap near a handle or tap between to focus)
 * - 60 FPS scrolling via Reanimated 3 decay physics & snap alignment
 * - Min/max selectable span in days (`minSpanDays`, `maxSpanDays`)
 * - Automatic Dark/Light mode theme detection
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
    header = true,
    indicator = true,
    rangeHighlightColor,
    ...rootProps
  } = props;

  const isHeaderVisible = header !== false;
  const indicatorConfig = typeof indicator === 'object' ? indicator : undefined;

  return (
    <RulerRangeRoot
      {...rootProps}
      indicator={indicatorConfig}
      rangeHighlightColor={rangeHighlightColor}
    >
      {isHeaderVisible && <RulerRangeHeader />}
      <RulerRangeTrack />
    </RulerRangeRoot>
  );
}

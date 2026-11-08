import React from 'react';
import type { RulerDateRangePickerProps } from './types';
import { RulerRangeRoot } from './RulerRangeRoot';
import { RulerRangeHeader } from './RulerRangeHeader';
import { RulerRangeTrack } from './RulerRangeTrack';

/**
 * A performant, customizable horizontal ruler date range picker for React Native & Expo.
 *
 * @experimental This component is experimental. The API surface, options, and physics
 * mechanics may undergo breaking changes in future minor releases as dual-handle
 * interactions and gestures are refined.
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
    highlight = true,
    ...rootProps
  } = props;

  const isHeaderVisible = header !== false;
  const headerConfig = typeof header === 'object' ? header : undefined;
  const indicatorConfig = typeof indicator === 'object' ? indicator : undefined;
  const highlightConfig = typeof highlight === 'object' ? highlight : undefined;

  return (
    <RulerRangeRoot
      {...rootProps}
      header={header}
      indicator={indicatorConfig}
      highlight={highlightConfig}
    >
      {isHeaderVisible && <RulerRangeHeader {...headerConfig} />}
      <RulerRangeTrack />
    </RulerRangeRoot>
  );
}

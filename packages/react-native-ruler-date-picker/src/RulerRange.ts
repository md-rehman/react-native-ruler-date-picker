import { RulerRangeRoot } from './RulerRangeRoot';
import { RulerRangeTrack } from './RulerRangeTrack';
import { RulerRangeHeader } from './RulerRangeHeader';
import { RulerRangeIndicator } from './RulerRangeIndicator';
import { RulerRangeHighlight } from './RulerRangeHighlight';
import { RulerRangeTicks } from './RulerRangeTicks';
import { Tick } from './Tick';

/**
 * Compound Anatomy API for Date Range Ruler Picker.
 *
 * @experimental This compound API is experimental and subject to breaking changes.
 *
 * @example
 * ```tsx
 * <RulerRange.Root value={range} onChange={setRange}>
 *   <RulerRange.Header />
 *   <RulerRange.Track>
 *     <RulerRange.Indicator />
 *     <RulerRange.Ticks />
 *   </RulerRange.Track>
 * </RulerRange.Root>
 * ```
 */
export const RulerRange = {
  Root: RulerRangeRoot,
  Track: RulerRangeTrack,
  Indicator: RulerRangeIndicator,
  Header: RulerRangeHeader,
  Highlight: RulerRangeHighlight,
  Ticks: RulerRangeTicks,
  Tick: Tick,
};

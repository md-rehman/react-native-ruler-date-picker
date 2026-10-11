import { RulerRangeRoot } from './RulerRangeRoot';
import { RulerRangeTrack } from './RulerRangeTrack';
import { RulerRangeHeader } from './RulerRangeHeader';
import { RulerRangeHighlight } from './RulerRangeHighlight';
import { Tick } from './Tick';

/**
 * Compound Anatomy API for Date Range Ruler Picker.
 *
 * @example
 * ```tsx
 * <RulerRange.Root value={range} onChange={setRange}>
 *   <RulerRange.Header />
 *   <RulerRange.Track>
 *     <RulerRange.Highlight />
 *   </RulerRange.Track>
 * </RulerRange.Root>
 * ```
 */
export const RulerRange = {
  Root: RulerRangeRoot,
  Track: RulerRangeTrack,
  Header: RulerRangeHeader,
  Highlight: RulerRangeHighlight,
  Tick: Tick,
};

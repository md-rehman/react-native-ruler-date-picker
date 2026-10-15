import { RulerRoot } from './RulerRoot';
import { RulerTrack } from './RulerTrack';
import { RulerIndicator } from './RulerIndicator';
import { RulerTicks } from './RulerTicks';
import { Tick } from './Tick';
import { RulerHeader } from './RulerHeader';
import { RulerResetButton } from './RulerResetButton';
import { RulerLensTrack } from './RulerLensTrack';
import { RulerLensTicks } from './RulerLensTicks';

/**
 * Compound Anatomy API for the Ruler Date Picker.
 *
 * @example
 * ```tsx
 * <Ruler.Root value={selectedDate} onChange={setSelectedDate}>
 *   <Ruler.Header />
 *   <Ruler.LensTrack />
 * </Ruler.Root>
 * ```
 */
export const Ruler = {
  Root: RulerRoot,
  Track: RulerTrack,
  LensTrack: RulerLensTrack,
  Ticks: RulerTicks,
  LensTicks: RulerLensTicks,
  Indicator: RulerIndicator,
  Tick: Tick,
  Header: RulerHeader,
  ResetButton: RulerResetButton,
};

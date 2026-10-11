import { RulerRoot } from './RulerRoot';
import { RulerTrack } from './RulerTrack';
import { RulerIndicator } from './RulerIndicator';
import { RulerTicks } from './RulerTicks';
import { Tick } from './Tick';
import { RulerHeader } from './RulerHeader';
import { RulerResetButton } from './RulerResetButton';

/**
 * Compound Anatomy API for the Ruler Date Picker.
 *
 * @example
 * ```tsx
 * <Ruler.Root value={selectedDate} onChange={setSelectedDate}>
 *   <Ruler.Header />
 *   <Ruler.Track>
 *     <Ruler.Indicator />
 *     <Ruler.Ticks />
 *   </Ruler.Track>
 *   <Ruler.ResetButton />
 * </Ruler.Root>
 * ```
 */
export const Ruler = {
  Root: RulerRoot,
  Track: RulerTrack,
  Indicator: RulerIndicator,
  Ticks: RulerTicks,
  Tick: Tick,
  Header: RulerHeader,
  ResetButton: RulerResetButton,
};

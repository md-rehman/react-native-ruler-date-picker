// ── Components ─────────────────────────────────────────────────────────────
export { RulerDatePicker } from './RulerDatePicker';
export { RulerDateRangePicker } from './RulerDateRangePicker';
export { Ruler } from './Ruler';
export { RulerRange } from './RulerRange';
export { Tick } from './Tick';
export { RulerLensTrack } from './RulerLensTrack';
export { RulerLensTicks } from './RulerLensTicks';
export { LensTick } from './LensTick';

// ── Headless Hooks ─────────────────────────────────────────────────────────
export { useRulerDatePicker, type UseRulerDatePickerReturn } from './useRulerDatePicker';
export { useRulerDateRangePicker, type UseRulerDateRangePickerReturn } from './useRulerDateRangePicker';
export { useHaptics } from './useHaptics';

// ── Presets & Resolvers ───────────────────────────────────────────────────
export {
  DEFAULT_CALENDAR_TICKS,
  DEFAULT_METRIC_TICKS,
  DEFAULT_MINIMAL_TICKS,
  resolveTickRules,
} from './presets';
export { resolveTick, matchesCondition } from './tickResolver';

// ── Utilities & Constants ─────────────────────────────────────────────────
export {
  formatDateString,
  normalizeDate,
  dateToDayOffset,
  dayOffsetToDate,
  computeDayRange,
  useResolvedTheme,
} from './utils';
export { DEFAULTS, DEFAULT_LENS_CONFIG, LIGHT_THEME, DARK_THEME, MS_PER_DAY } from './defaults';

// ── Types ──────────────────────────────────────────────────────────────────
export type {
  TickContext,
  TickCondition,
  TickLabelConfig,
  TickDotConfig,
  TickRule,
  ResolvedTick,
  RulerTheme,
  ResolvedRulerTheme,
  RulerDatePickerProps,
  LensConfig,
  DateRange,
  DateRangeChangePayload,
  RulerDateRangePickerProps,
} from './types';
export type { RulerRootProps } from './RulerRoot';
export type { RulerTrackProps } from './RulerTrack';
export type { RulerLensTrackProps } from './RulerLensTrack';
export type { RulerLensTicksProps } from './RulerLensTicks';
export type { LensTickProps } from './LensTick';
export type { RulerIndicatorProps } from './RulerIndicator';
export type { RulerTicksProps } from './RulerTicks';
export type { RulerHeaderProps } from './RulerHeader';
export type { RulerResetButtonProps } from './RulerResetButton';
export type { RulerRangeRootProps } from './RulerRangeRoot';
export type { RulerRangeTrackProps } from './RulerRangeTrack';
export type { RulerRangeHeaderProps } from './RulerRangeHeader';
export type { RulerRangeHighlightProps } from './RulerRangeHighlight';
export type { TickProps } from './Tick';

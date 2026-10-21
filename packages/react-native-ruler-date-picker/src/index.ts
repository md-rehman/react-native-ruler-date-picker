// ── Components ─────────────────────────────────────────────────────────────
export { RulerDatePicker } from './RulerDatePicker';
export { RulerDateRangePicker } from './RulerDateRangePicker';
export { Ruler } from './Ruler';
export { RulerRange } from './RulerRange';
export { Tick } from './Tick';
export { RulerLensTrack } from './RulerLensTrack';
export { RulerLensTicks } from './RulerLensTicks';
export { LensTick } from './LensTick';

// ── Compound Subcomponents ──────────────────────────────────────────────────
export { RulerRoot, type RulerRootProps } from './RulerRoot';
export { RulerTrack, type RulerTrackProps } from './RulerTrack';
export { RulerIndicator, type RulerIndicatorProps } from './RulerIndicator';
export { RulerTicks, type RulerTicksProps } from './RulerTicks';
export { RulerHeader, type RulerHeaderProps } from './RulerHeader';
export { RulerResetButton, type RulerResetButtonProps } from './RulerResetButton';
export { RulerRangeRoot, type RulerRangeRootProps } from './RulerRangeRoot';
export { RulerRangeTrack, type RulerRangeTrackProps } from './RulerRangeTrack';
export { RulerRangeHeader, type RulerRangeHeaderProps } from './RulerRangeHeader';
export { RulerRangeHighlight, type RulerRangeHighlightProps } from './RulerRangeHighlight';

// ── Headless Hooks & Contexts ───────────────────────────────────────────────
export { useRulerDatePicker, type UseRulerDatePickerReturn } from './useRulerDatePicker';
export { useRulerDateRangePicker, type UseRulerDateRangePickerReturn } from './useRulerDateRangePicker';
export { useHaptics } from './useHaptics';
export { RulerContext, useRulerContext, type RulerContextValue } from './RulerContext';
export { RulerRangeContext, useRulerRangeContext, type RulerRangeContextValue } from './RulerRangeContext';

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
  IndicatorConfig,
  HeaderConfig,
  RangeHeaderConfig,
  RangeHeaderContext,
  HapticConfig,
  RulerDatePickerProps,
  LensConfig,
  DateRange,
  DateRangeChangePayload,
  RulerDateRangePickerProps,
} from './types';
export type { LensTickProps } from './LensTick';
export type { RulerLensTrackProps } from './RulerLensTrack';
export type { RulerLensTicksProps } from './RulerLensTicks';
export type { TickProps } from './Tick';

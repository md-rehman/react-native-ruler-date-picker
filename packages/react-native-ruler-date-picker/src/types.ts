import type React from 'react';
import type { StyleProp, ViewStyle, TextStyle } from 'react-native';

// ── Tick System Types ────────────────────────────────────────────────────────

/**
 * Context provided to each tick rule during evaluation.
 */
export interface TickContext {
  /** The Date represented by this tick */
  date: Date;
  /** Day offset relative to reference time (0 = today) */
  offset: number;
  /** True if this date is today */
  isToday: boolean;
  /** True if this date matches the currently selected date */
  isSelected: boolean;
  /** True if this date falls within the selected range (range picker mode) */
  isInRange?: boolean;
}

/**
 * Predicate condition determining when a tick rule matches.
 */
export type TickCondition =
  | 'daily'                     // Matches every day (base / fallback)
  | 'weekly'                    // Every 7th day relative to reference
  | 'monthly'                   // 1st day of each month
  | 'yearly'                    // Jan 1st of each year
  | { interval: number }        // Every N days (offset % interval === 0)
  | { dayOfWeek: number[] }     // Days of week: 0 = Sun, 1 = Mon, ..., 6 = Sat
  | ((ctx: TickContext) => boolean); // Custom predicate callback

/**
 * Configuration for tick date labels.
 */
export interface TickLabelConfig {
  /** Custom label text formatter */
  format?: (date: Date, ctx: TickContext) => string;
  /** Text color override */
  color?: string;
  /** Font size in pixels (default: 10) */
  fontSize?: number;
  /** Font weight */
  fontWeight?: TextStyle['fontWeight'];
}

/**
 * Configuration for the dot indicator (e.g. today dot or milestone badge).
 */
export interface TickDotConfig {
  /** Dot diameter in pixels (default: 6) */
  size?: number;
  /** Dot fill color */
  color?: string;
}

/**
 * Complete declarative definition for a tick variant.
 * Evaluated top-to-bottom; first matching rule is applied.
 */
export interface TickRule {
  /**
   * When this rule applies.
   * If omitted, this rule matches unconditionally (serves as the fallback).
   */
  condition?: TickCondition;

  /** Height of the tick bar in pixels */
  height: number;

  /** Width/thickness of the tick bar in pixels (defaults to tickThickness or 3) */
  width?: number;

  /** Color of the tick bar */
  color?: string;

  /** Label configuration or boolean (true uses day number) */
  label?: boolean | TickLabelConfig;

  /** Dot badge indicator (e.g., today marker) */
  dot?: boolean | TickDotConfig;

  /** Custom React component render override for this tick */
  render?: (ctx: TickContext) => React.ReactNode;
}

/**
 * Resolved visual attributes for rendering a single tick.
 */
export interface ResolvedTick {
  offset: number;
  date: Date;
  dateStr: string;
  height: number;
  width: number;
  color: string;
  labelText?: string;
  labelColor: string;
  labelFontSize: number;
  labelFontWeight: TextStyle['fontWeight'];
  hasDot: boolean;
  dotSize: number;
  dotColor: string;
  customRender?: (ctx: TickContext) => React.ReactNode;
  isToday: boolean;
  isSelected: boolean;
  isInRange: boolean;
}

// ── Theming & Styling ────────────────────────────────────────────────────────

export interface RulerTheme {
  /** Background color of the picker component */
  background?: string;
  /** Color of the center selection needle */
  indicatorColor?: string;
  /** Primary accent color (used for today dot, active labels, etc.) */
  accentColor?: string;
  /** Default label text color */
  labelColor?: string;
  /** Default tick bar color when not overridden by a rule */
  defaultTickColor?: string;
  /** Color for range selection connecting bar in range mode */
  rangeHighlightColor?: string;
}

export type ResolvedRulerTheme = Required<RulerTheme>;

// ── Single Picker Props ──────────────────────────────────────────────────────

export interface RulerDatePickerProps {
  // ── Value & Selection ──
  /** Currently selected date (controlled). Accepts Date or YYYY-MM-DD string. */
  value?: Date | string;
  /** Alias for value */
  selectedDate?: Date | string;
  /** Initial selected date (uncontrolled). Accepts Date or YYYY-MM-DD string. */
  defaultValue?: Date | string;
  /** Called when user scrolls to a date */
  onChange?: (date: Date, dateString: string) => void;
  /** Alias for onChange */
  onSelectDate?: (date: Date, dateString: string) => void;
  /** Minimum selectable date */
  minDate?: Date | string;
  /** Maximum selectable date */
  maxDate?: Date | string;

  // ── Tick Configuration ──
  /** Array of tick rules or a preset name ('calendar' | 'metric' | 'minimal') */
  ticks?: TickRule[] | 'calendar' | 'metric' | 'minimal';
  /** Distance in pixels between tick centers (default: 24) */
  tickSpacing?: number;
  /** Default thickness of tick bars in pixels (default: 3) */
  tickThickness?: number;
  /** Legacy tick height props for backward compatibility */
  tickHeight?: number;
  tickTallHeight?: number;
  tickColor?: string;
  tickTallColor?: string;
  labelInterval?: 'daily' | 'weekly' | 'monthly' | ((date: Date) => boolean);

  // ── Indicator ──
  /** Width of the center indicator needle in pixels (default: 2) */
  indicatorWidth?: number;
  /** Height of the center indicator needle in pixels (default: 40) */
  indicatorHeight?: number;
  /** Color override for the center indicator */
  indicatorColor?: string;
  /** Custom renderer for the center indicator */
  renderIndicator?: () => React.ReactNode;

  // ── Header & Reset Controls ──
  /** Show default date/year header (default: true) */
  showHeader?: boolean;
  /** Show "Today" reset button when not on today (default: false) */
  showResetToToday?: boolean;
  /** Custom header renderer replacing the default header */
  renderHeader?: (
    selectedDate: Date,
    isToday: boolean,
    resetToToday: () => void
  ) => React.ReactNode;

  // ── Dimensions & Theming ──
  /** Total height of the component in pixels (default: 120) */
  height?: number;
  /** Height of the ruler track area in pixels (default: 60) */
  rulerHeight?: number;
  /** Color theme overrides or full palette */
  theme?: RulerTheme;
  /** Legacy color props */
  backgroundColor?: string;
  accentColor?: string;
  labelColor?: string;
  /** Container style */
  style?: StyleProp<ViewStyle>;

  // ── Performance & Haptics ──
  /** Number of off-screen ticks to buffer on each side (default: 10) */
  bufferTicks?: number;
  /** Debounce ms for onChange during scrolling (default: 100) */
  debounceMs?: number;
  /** Enable haptic feedback (default: true) */
  enableHaptics?: boolean;
  /** Custom haptic callback */
  onHapticTrigger?: (mode: 'tick' | 'continuous') => void;
  /** Speed threshold (ticks/frame) to trigger continuous haptic mode (default: 1) */
  fastSwipeTickThreshold?: number;
  /** Pulse interval in ms during continuous haptic mode (default: 20) */
  continuousHapticIntervalMs?: number;

  /** Test ID for automated tests */
  testID?: string;
}

// ── Range Picker Types ───────────────────────────────────────────────────────

export interface DateRange {
  start: Date | string;
  end: Date | string;
}

export interface DateRangeChangePayload {
  startDate: Date;
  endDate: Date;
  startString: string;
  endString: string;
}

export interface RulerDateRangePickerProps
  extends Omit<
    RulerDatePickerProps,
    'value' | 'defaultValue' | 'onChange' | 'renderIndicator'
  > {
  /** Currently selected date range (controlled) */
  value?: DateRange;
  /** Initial selected date range (uncontrolled) */
  defaultValue?: DateRange;
  /** Called when the selected range changes */
  onChange?: (range: DateRangeChangePayload) => void;

  /** Minimum selectable span in days (default: 1) */
  minSpanDays?: number;
  /** Maximum selectable span in days */
  maxSpanDays?: number;

  /** Color of the range connecting highlight strip */
  rangeHighlightColor?: string;
  /** Custom renderer for the range highlight span */
  renderRangeHighlight?: (
    startOffset: number,
    endOffset: number,
    tickSpacing: number
  ) => React.ReactNode;
  /** Custom renderer for range handle indicators */
  renderRangeIndicator?: (
    handle: 'start' | 'end',
    date: Date
  ) => React.ReactNode;
}

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

  /** Width/thickness of the tick bar in pixels (defaults to tickWidth or 3) */
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

/**
 * Configuration for the center alignment needle indicator.
 */
export interface IndicatorConfig {
  /** Width of the center indicator needle in pixels (default: 2) */
  width?: number;
  /** Height of the center indicator needle in pixels (default: 40) */
  height?: number;
  /** Color of the center indicator needle */
  color?: string;
  /** Vertical alignment of the indicator needle in track (default: 'bottom') */
  alignment?: 'bottom' | 'center' | 'top';
  /** Custom style for the center indicator needle */
  style?: StyleProp<ViewStyle>;
  /** Custom renderer for the center indicator */
  render?: () => React.ReactNode;
}

/**
 * Configuration for the date picker header.
 */
export interface HeaderConfig {
  /** Show "Today" reset button when not on today (default: false) */
  showResetToToday?: boolean;
  /** Text label for the reset button (default: 'Today') */
  resetLabel?: string;
  /** Header container style */
  style?: StyleProp<ViewStyle>;
  /** Header date label style */
  dateStyle?: StyleProp<TextStyle>;
  /** Header year label style */
  yearStyle?: StyleProp<TextStyle>;
  /** Custom date format function for the header text */
  format?: (date: Date) => string;
  /** Custom header renderer replacing the default header */
  render?: (
    selectedDate: Date,
    isToday: boolean,
    resetToToday: () => void
  ) => React.ReactNode;
}

/**
 * Configuration for tactile haptic feedback.
 */
export interface HapticConfig {
  /** Whether haptics are enabled (default: true) */
  enabled?: boolean;
  /** Custom haptic callback (e.g. for Expo Haptics) */
  onTrigger?: (mode: 'tick' | 'continuous') => void;
  /** Speed threshold (ticks/frame) to trigger continuous buzz mode (default: 1) */
  fastSwipeTickThreshold?: number;
  /** Pulse interval in ms during continuous haptic mode (default: 20) */
  continuousHapticIntervalMs?: number;
}

export interface RulerDatePickerProps {
  // ── Value & Selection ──
  /** Currently selected date (controlled). Accepts Date or YYYY-MM-DD string. */
  value?: Date | string;
  /** Initial selected date (uncontrolled). Accepts Date or YYYY-MM-DD string. */
  defaultValue?: Date | string;
  /** Called when user scrolls to a date */
  onChange?: (date: Date, dateString: string) => void;
  /** Minimum selectable date */
  minDate?: Date | string;
  /** Maximum selectable date */
  maxDate?: Date | string;
  /** BCP 47 locale string for date formatting (default: system 'default') */
  locale?: string;

  // ── Tick Configuration ──
  /** Array of tick rules or a preset name ('calendar' | 'metric' | 'minimal') */
  ticks?: TickRule[] | 'calendar' | 'metric' | 'minimal';
  /** Distance in pixels between tick centers (default: 24) */
  tickSpacing?: number;
  /** Base width of tick bars in pixels (default: 3) */
  tickWidth?: number;

  // ── Dimensions & Theming ──
  /** Width of the ruler viewport track in pixels (default: window width) */
  width?: number;
  /** Height of the ruler track area in pixels (default: 60) */
  rulerHeight?: number;
  /** Color theme overrides (background, indicatorColor, accentColor, labelColor, etc.) */
  theme?: RulerTheme;
  /** Container style */
  style?: StyleProp<ViewStyle>;

  // ── Indicator, Header, & Haptics (Consolidated APIs) ──
  /** Center indicator needle configuration or boolean toggle (default: true) */
  indicator?: boolean | IndicatorConfig;
  /** Header configuration or boolean toggle (default: true) */
  header?: boolean | HeaderConfig;
  /** Haptics configuration or boolean toggle (default: true) */
  haptics?: boolean | HapticConfig;

  // ── Fisheye Lens Effect ──
  /**
   * Enable non-linear fisheye lens distortion where tick spacing is wider near the center
   * needle and gradually flattens out to standard spacing away from the center.
   * Can be true (for default configuration) or a custom LensConfig object.
   */
  lensEffect?: boolean | LensConfig;

  // ── Performance ──
  /** Debounce ms for onChange during scrolling (default: 100) */
  debounceMs?: number;

  /** Test ID for automated tests */
  testID?: string;
  /** Accessibility label for assistive technologies / screen readers */
  accessibilityLabel?: string;
}

// ── Fisheye Lens Types ───────────────────────────────────────────────────────

export interface LensConfig {
  /**
   * Spacing magnification factor at the center needle.
   * (e.g. 1.6 means 60% wider spacing at the needle).
   * Default: 1.6
   */
  magnification?: number;
  /**
   * Radius in pixels around the center needle over which the magnification
   * smoothly transitions back to standard linear spacing.
   * Default: 60
   */
  radius?: number;
  /**
   * Whether to subtly scale tick bar height and label prominence near the center.
   * Default: true
   */
  scaleTicks?: boolean;
}

// ── Range Picker Types ───────────────────────────────────────────────────────

export interface DateRange {
  start: Date | string;
  end: Date | string;
}

export interface DateRangeChangePayload {
  start: Date;
  end: Date;
  startDate: Date;
  endDate: Date;
  startString: string;
  endString: string;
  spanDays: number;
}

export interface RangeHeaderContext {
  start: Date;
  end: Date;
  spanDays: number;
  activeHandle: 'start' | 'end';
  scrollToHandle: (handle: 'start' | 'end', animated?: boolean) => void;
}

export interface RangeHeaderConfig {
  /** Header container style */
  style?: StyleProp<ViewStyle>;
  /** Header date label style */
  dateStyle?: StyleProp<TextStyle>;
  /** Custom date format function for start/end labels */
  format?: (date: Date) => string;
  /** Custom header renderer replacing default range header */
  render?: (context: RangeHeaderContext) => React.ReactNode;
}

/**
 * Configuration for the date range highlight span connecting the handles.
 */
export interface RangeHighlightConfig {
  /** Color of the range connecting highlight strip (default: theme.rangeHighlightColor) */
  color?: string;
  /** Custom style for the range highlight span */
  style?: StyleProp<ViewStyle>;
  /** Custom renderer for the range highlight span */
  render?: (
    startOffset: number,
    endOffset: number,
    tickSpacing: number
  ) => React.ReactNode;
}

/**
 * Configuration for the center indicator needle in range mode.
 */
export interface RangeIndicatorConfig extends Omit<IndicatorConfig, 'render'> {
  /** Custom renderer for range needle indicator receiving active handle and date */
  render?: (handle: 'start' | 'end', date: Date) => React.ReactNode;
}

export interface RulerDateRangePickerProps
  extends Omit<RulerDatePickerProps, 'value' | 'defaultValue' | 'onChange' | 'header' | 'indicator'> {
  /** Currently selected date range (controlled) */
  value?: DateRange;
  /** Initial selected date range (uncontrolled) */
  defaultValue?: DateRange;
  /** Called when the selected range changes */
  onChange?: (range: DateRangeChangePayload) => void;
  /** Header configuration or boolean toggle (default: true) */
  header?: boolean | RangeHeaderConfig;
  /** Center indicator needle configuration or boolean toggle (default: true) */
  indicator?: boolean | RangeIndicatorConfig;
  /** Range connecting highlight strip configuration or boolean toggle (default: true) */
  highlight?: boolean | RangeHighlightConfig;

  /** Minimum selectable span in days (default: 1) */
  minSpanDays?: number;
  /** Maximum selectable span in days */
  maxSpanDays?: number;
}

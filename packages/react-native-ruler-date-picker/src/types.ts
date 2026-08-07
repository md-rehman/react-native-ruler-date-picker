import type React from 'react';

export interface RulerDatePickerProps {
  // ── Selection & Bounds ─────────────────────────────────────
  /** The currently selected date. Accepts a Date object or a YYYY-MM-DD string. */
  selectedDate: Date | string;
  /**
   * Called when the user scrolls to a new date.
   * Provides both the Date object and the formatted YYYY-MM-DD string.
   */
  onSelectDate: (date: Date, dateString: string) => void;
  /** Minimum selectable date. Defaults to 365 days before today. */
  minDate?: Date;
  /** Maximum selectable date. Defaults to 365 days after today. */
  maxDate?: Date;

  // ── Label & Highlight Rules ────────────────────────────────
  /**
   * Controls which ticks show a date label.
   * - `'daily'` — every tick gets a label
   * - `'weekly'` (default) — every 7th day
   * - `'monthly'` — 1st of each month
   * - `(date: Date) => boolean` — custom callback
   */
  labelInterval?: 'daily' | 'weekly' | 'monthly' | ((date: Date) => boolean);
  /** Days of the week to visually highlight. 0 = Sunday, 6 = Saturday. e.g. [0, 6] for weekends. */
  highlightDays?: number[];

  // ── Tick Dimensions ────────────────────────────────────────
  /** Gap between ticks in pixels. Default: 24 */
  tickSpacing?: number;
  /** Height of small (unlabeled) ticks in pixels. Default: 12 */
  tickHeight?: number;
  /** Height of tall (labeled) ticks in pixels. Default: 24 */
  tickTallHeight?: number;
  /** Width of each tick bar in pixels. Default: 4 */
  tickThickness?: number;

  // ── Tick Colors (small & large independently) ──────────────
  /** Color of small (unlabeled) ticks. */
  tickColor?: string;
  /** Color of tall (labeled) ticks. Falls back to tickColor if not specified. */
  tickTallColor?: string;

  // ── Label & Accent Colors ─────────────────────────────────
  /** Color of date label text beneath labeled ticks. */
  labelColor?: string;
  /** Color of the today dot indicator and reset button text. */
  accentColor?: string;
  /** Color of the center selection indicator line. */
  indicatorColor?: string;
  /** Background color of the entire component. Default: transparent */
  backgroundColor?: string;

  // ── Layout Dimensions ─────────────────────────────────────
  /** Total component height in pixels. Default: 120 */
  height?: number;
  /** Height of the ruler track area in pixels. Default: 60 */
  rulerHeight?: number;
  /** Width of the center selection indicator bar in pixels. Default: 2 */
  indicatorWidth?: number;
  /** Height of the center selection indicator bar in pixels. Default: 40 */
  indicatorHeight?: number;
  /** Diameter of the today dot indicator in pixels. Default: 6 */
  todayDotSize?: number;
  /** Font size of tick date labels in pixels. Default: 10 */
  labelFontSize?: number;

  // ── Performance Tuning ────────────────────────────────────
  /** Number of off-screen ticks to render as buffer on each side. Default: 10 */
  bufferTicks?: number;
  /** Debounce interval in ms before calling onSelectDate. Default: 100 */
  updateDebounceMs?: number;

  // ── Haptic Tuning ─────────────────────────────────────────
  /** Enable or disable haptic feedback. Default: true */
  enableHaptics?: boolean;
  /**
   * Custom haptic trigger callback. When provided, overrides the default
   * expo-haptics implementation. Receives the haptic mode:
   * - `'tick'` — single discrete haptic (slow scrolling)
   * - `'continuous'` — continuous buzz (fast scrolling)
   */
  onHapticTrigger?: (mode: 'tick' | 'continuous') => void;
  /** Number of ticks crossed per frame to trigger fast/continuous haptic mode. Default: 1 */
  fastSwipeTickThreshold?: number;
  /** Interval in ms between haptic pulses in continuous mode. Default: 20 */
  continuousHapticIntervalMs?: number;

  // ── Reset Control ─────────────────────────────────────────
  /** Show a "Today" reset button when not on today's date. Default: false */
  showResetToToday?: boolean;

  // ── Custom Renderers ──────────────────────────────────────
  /**
   * Custom header renderer. When provided, replaces the default date header.
   * Receives the selected date, whether it's today, and a function to reset to today.
   */
  renderHeader?: (
    selectedDate: Date,
    isToday: boolean,
    resetToToday: () => void
  ) => React.ReactNode;
}

/**
 * Internal type for resolved color values.
 * @internal
 */
export interface ResolvedColors {
  tickColor: string;
  tickTallColor: string;
  labelColor: string;
  accentColor: string;
  indicatorColor: string;
  backgroundColor: string;
}

/**
 * Internal tick data used for rendering.
 * @internal
 */
export interface TickData {
  offset: number;
  isLabeled: boolean;
  isToday: boolean;
  isHighlighted: boolean;
  dateStr: string;
}

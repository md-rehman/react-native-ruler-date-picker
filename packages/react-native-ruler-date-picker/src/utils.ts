import { useColorScheme } from 'react-native';
import { LIGHT_THEME, DARK_THEME, MS_PER_DAY, DEFAULT_DAY_RANGE } from './defaults';
import type { RulerTheme, ResolvedRulerTheme } from './types';

/**
 * Formats a Date object as a local YYYY-MM-DD string,
 * avoiding timezone shifting bugs caused by toISOString().
 */
export function formatDateString(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Normalizes a Date or string to a local midnight Date object.
 */
export function normalizeDate(input?: Date | string): Date {
  const d = input ? (typeof input === 'string' ? new Date(input) : new Date(input.getTime())) : new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Converts a Date or YYYY-MM-DD string to a day offset relative to a reference time.
 */
export function dateToDayOffset(
  date: Date | string,
  referenceTime: number
): number {
  const d = normalizeDate(date);
  return Math.round((d.getTime() - referenceTime) / MS_PER_DAY);
}

/**
 * Converts a day offset back to a Date object at midnight.
 */
export function dayOffsetToDate(offset: number, referenceTime: number): Date {
  return new Date(referenceTime + offset * MS_PER_DAY);
}

/**
 * Computes the min/max day offsets from props or defaults.
 */
export function computeDayRange(
  todayTime: number,
  minDate?: Date | string,
  maxDate?: Date | string
): { minOffset: number; maxOffset: number } {
  let minOffset = -DEFAULT_DAY_RANGE;
  let maxOffset = DEFAULT_DAY_RANGE;

  if (minDate) {
    const d = normalizeDate(minDate);
    minOffset = Math.round((d.getTime() - todayTime) / MS_PER_DAY);
  }

  if (maxDate) {
    const d = normalizeDate(maxDate);
    maxOffset = Math.round((d.getTime() - todayTime) / MS_PER_DAY);
  }

  return { minOffset, maxOffset };
}

/**
 * Resolves user-provided theme against the system color scheme defaults (Light/Dark),
 * with backward-compatible fallback to legacy flat color props.
 */
export function useResolvedTheme(
  theme?: RulerTheme,
  legacyProps?: {
    backgroundColor?: string;
    indicatorColor?: string;
    accentColor?: string;
    labelColor?: string;
    defaultTickColor?: string;
    tickColor?: string;
    rangeHighlightColor?: string;
  }
): ResolvedRulerTheme {
  const scheme = useColorScheme();
  const palette = scheme === 'dark' ? DARK_THEME : LIGHT_THEME;

  return {
    background: theme?.background ?? legacyProps?.backgroundColor ?? palette.background,
    indicatorColor: theme?.indicatorColor ?? legacyProps?.indicatorColor ?? palette.indicatorColor,
    accentColor: theme?.accentColor ?? legacyProps?.accentColor ?? palette.accentColor,
    labelColor: theme?.labelColor ?? legacyProps?.labelColor ?? palette.labelColor,
    defaultTickColor:
      theme?.defaultTickColor ??
      legacyProps?.defaultTickColor ??
      legacyProps?.tickColor ??
      palette.defaultTickColor,
    rangeHighlightColor: theme?.rangeHighlightColor ?? legacyProps?.rangeHighlightColor ?? palette.rangeHighlightColor,
  };
}

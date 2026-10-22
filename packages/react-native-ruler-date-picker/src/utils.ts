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
 * Parses YYYY-MM-DD explicitly as local midnight to avoid UTC timezone shifts,
 * and guards against Invalid Dates.
 */
export function normalizeDate(input?: Date | string): Date {
  let d: Date;
  if (!input) {
    d = new Date();
  } else if (typeof input === 'string') {
    const parts = input.trim().split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      d = new Date(year, month, day);
    } else {
      d = new Date(input);
    }
  } else {
    d = new Date(input.getTime());
  }

  if (isNaN(d.getTime())) {
    d = new Date();
  }

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
 * Converts a day offset back to a Date object at local midnight.
 * Uses native calendar math (setDate) to avoid Daylight Saving Time (DST) 23h/25h hour drift.
 */
export function dayOffsetToDate(offset: number, referenceTime: number): Date {
  const d = new Date(referenceTime);
  d.setDate(d.getDate() + offset);
  d.setHours(0, 0, 0, 0);
  return d;
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

  if (minOffset > maxOffset) {
    const temp = minOffset;
    minOffset = maxOffset;
    maxOffset = temp;
  }

  return { minOffset, maxOffset };
}

/**
 * Resolves user-provided theme against the system color scheme defaults (Light/Dark).
 */
export function useResolvedTheme(theme?: RulerTheme): ResolvedRulerTheme {
  const scheme = useColorScheme();
  const palette = scheme === 'dark' ? DARK_THEME : LIGHT_THEME;

  return {
    background: theme?.background ?? palette.background,
    indicatorColor: theme?.indicatorColor ?? palette.indicatorColor,
    accentColor: theme?.accentColor ?? palette.accentColor,
    labelColor: theme?.labelColor ?? palette.labelColor,
    defaultTickColor: theme?.defaultTickColor ?? palette.defaultTickColor,
    rangeHighlightColor: theme?.rangeHighlightColor ?? palette.rangeHighlightColor,
  };
}

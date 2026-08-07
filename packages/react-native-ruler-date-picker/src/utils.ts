import { useColorScheme } from 'react-native';
import { LIGHT_COLORS, DARK_COLORS, MS_PER_DAY, DEFAULT_DAY_RANGE } from './defaults';
import type { RulerDatePickerProps, ResolvedColors } from './types';

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
 * Converts a Date or YYYY-MM-DD string to a day offset relative to a reference time.
 */
export function dateToDayOffset(
  date: Date | string,
  referenceTime: number
): number {
  const d = typeof date === 'string' ? new Date(date) : new Date(date);
  d.setHours(0, 0, 0, 0);
  return Math.round((d.getTime() - referenceTime) / MS_PER_DAY);
}

/**
 * Converts a day offset back to a Date object.
 */
export function dayOffsetToDate(offset: number, referenceTime: number): Date {
  return new Date(referenceTime + offset * MS_PER_DAY);
}

/**
 * Resolves user-provided color props against the system color scheme defaults.
 * User-provided values always take precedence.
 */
export function useResolvedColors(
  props: Pick<
    RulerDatePickerProps,
    | 'tickColor'
    | 'tickTallColor'
    | 'labelColor'
    | 'accentColor'
    | 'indicatorColor'
    | 'backgroundColor'
  >
): ResolvedColors {
  const scheme = useColorScheme();
  const palette = scheme === 'dark' ? DARK_COLORS : LIGHT_COLORS;

  return {
    tickColor: props.tickColor ?? palette.tickColor,
    tickTallColor: props.tickTallColor ?? props.tickColor ?? palette.tickTallColor,
    labelColor: props.labelColor ?? palette.labelColor,
    accentColor: props.accentColor ?? palette.accentColor,
    indicatorColor: props.indicatorColor ?? palette.indicatorColor,
    backgroundColor: props.backgroundColor ?? palette.backgroundColor,
  };
}

/**
 * Determines whether a date should display a label based on the labelInterval setting.
 */
export function shouldShowLabel(
  date: Date,
  labelInterval: RulerDatePickerProps['labelInterval'],
  todayTime: number
): boolean {
  if (!labelInterval || labelInterval === 'weekly') {
    // Default: every 7th day relative to today (matches original Friday-style spacing)
    const dayOffset = Math.round(
      (date.getTime() - todayTime) / MS_PER_DAY
    );
    return dayOffset % 7 === 0;
  }

  if (labelInterval === 'daily') {
    return true;
  }

  if (labelInterval === 'monthly') {
    return date.getDate() === 1;
  }

  // Custom callback
  return labelInterval(date);
}

/**
 * Computes the min/max day offsets from props or defaults.
 */
export function computeDayRange(
  todayTime: number,
  minDate?: Date,
  maxDate?: Date
): { minOffset: number; maxOffset: number } {
  let minOffset = -DEFAULT_DAY_RANGE;
  let maxOffset = DEFAULT_DAY_RANGE;

  if (minDate) {
    const d = new Date(minDate);
    d.setHours(0, 0, 0, 0);
    minOffset = Math.round((d.getTime() - todayTime) / MS_PER_DAY);
  }

  if (maxDate) {
    const d = new Date(maxDate);
    d.setHours(0, 0, 0, 0);
    maxOffset = Math.round((d.getTime() - todayTime) / MS_PER_DAY);
  }

  return { minOffset, maxOffset };
}

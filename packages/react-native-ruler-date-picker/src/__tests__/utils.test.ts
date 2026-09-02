import {
  formatDateString,
  dateToDayOffset,
  dayOffsetToDate,
  shouldShowLabel,
  computeDayRange,
} from '../utils';
import { MS_PER_DAY, DEFAULT_DAY_RANGE } from '../defaults';

describe('RulerDatePicker Utils', () => {
  describe('formatDateString', () => {
    it('formats date object to local YYYY-MM-DD string accurately', () => {
      const date = new Date(2026, 7, 7); // August 7, 2026 local time
      expect(formatDateString(date)).toBe('2026-08-07');
    });

    it('pads single-digit month and day with leading zeroes', () => {
      const date = new Date(2026, 0, 5); // January 5, 2026 local time
      expect(formatDateString(date)).toBe('2026-01-05');
    });
  });

  describe('dateToDayOffset and dayOffsetToDate', () => {
    const refDate = new Date(2026, 7, 1);
    refDate.setHours(0, 0, 0, 0);
    const refTime = refDate.getTime();

    it('converts date to day offset relative to reference time', () => {
      const targetDate = new Date(2026, 7, 8);
      targetDate.setHours(0, 0, 0, 0);
      expect(dateToDayOffset(targetDate, refTime)).toBe(7);
    });

    it('roundtrips day offset to date and back', () => {
      const offset = 14;
      const dateFromOffset = dayOffsetToDate(offset, refTime);
      const computedOffset = dateToDayOffset(dateFromOffset, refTime);
      expect(computedOffset).toBe(offset);
    });
  });

  describe('shouldShowLabel', () => {
    const today = new Date(2026, 7, 1);
    today.setHours(0, 0, 0, 0);
    const todayTime = today.getTime();

    it('daily: returns true for all dates', () => {
      const date = new Date(2026, 7, 3);
      expect(shouldShowLabel(date, 'daily', todayTime)).toBe(true);
    });

    it('weekly: returns true every 7th day from today', () => {
      const day0 = new Date(2026, 7, 1);
      const day7 = new Date(2026, 7, 8);
      const day3 = new Date(2026, 7, 4);

      expect(shouldShowLabel(day0, 'weekly', todayTime)).toBe(true);
      expect(shouldShowLabel(day7, 'weekly', todayTime)).toBe(true);
      expect(shouldShowLabel(day3, 'weekly', todayTime)).toBe(false);
    });

    it('monthly: returns true on the first day of month', () => {
      const firstOfMonth = new Date(2026, 8, 1); // Sept 1
      const midMonth = new Date(2026, 8, 15);

      expect(shouldShowLabel(firstOfMonth, 'monthly', todayTime)).toBe(true);
      expect(shouldShowLabel(midMonth, 'monthly', todayTime)).toBe(false);
    });

    it('custom callback: delegates to custom handler', () => {
      const customFn = (d: Date) => d.getDay() === 0; // Sundays only
      const sunday = new Date(2026, 7, 2); // August 2, 2026 is Sunday
      const monday = new Date(2026, 7, 3);

      expect(shouldShowLabel(sunday, customFn, todayTime)).toBe(true);
      expect(shouldShowLabel(monday, customFn, todayTime)).toBe(false);
    });
  });

  describe('computeDayRange', () => {
    const today = new Date(2026, 7, 1);
    today.setHours(0, 0, 0, 0);
    const todayTime = today.getTime();

    it('uses default day range if min/max date are not supplied', () => {
      const { minOffset, maxOffset } = computeDayRange(todayTime);
      expect(minOffset).toBe(-DEFAULT_DAY_RANGE);
      expect(maxOffset).toBe(DEFAULT_DAY_RANGE);
    });

    it('computes offset for explicit minDate and maxDate', () => {
      const minDate = new Date(2026, 6, 22); // 10 days before today
      const maxDate = new Date(2026, 7, 21); // 20 days after today

      const { minOffset, maxOffset } = computeDayRange(todayTime, minDate, maxDate);
      expect(minOffset).toBe(-10);
      expect(maxOffset).toBe(20);
    });
  });
});

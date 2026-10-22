import {
  formatDateString,
  normalizeDate,
  dateToDayOffset,
  dayOffsetToDate,
  computeDayRange,
} from '../utils';
import { DEFAULT_DAY_RANGE } from '../defaults';

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

  describe('normalizeDate', () => {
    it('sets hours to local midnight', () => {
      const date = new Date(2026, 5, 15, 14, 30, 45);
      const normalized = normalizeDate(date);
      expect(normalized.getHours()).toBe(0);
      expect(normalized.getMinutes()).toBe(0);
      expect(normalized.getSeconds()).toBe(0);
      expect(normalized.getMilliseconds()).toBe(0);
    });

    it('parses date string to midnight Date', () => {
      const normalized = normalizeDate('2026-10-15');
      expect(normalized.getFullYear()).toBe(2026);
      expect(normalized.getMonth()).toBe(9); // 0-indexed October
      expect(normalized.getDate()).toBe(15);
      expect(normalized.getHours()).toBe(0);
    });

    it('handles invalid date string gracefully by falling back to today', () => {
      const normalized = normalizeDate('not-a-real-date');
      expect(normalized).toBeInstanceOf(Date);
      expect(isNaN(normalized.getTime())).toBe(false);
      expect(normalized.getHours()).toBe(0);
    });

    it('parses YYYY-MM-DD in local time without UTC offset drift', () => {
      const normalized = normalizeDate('2026-01-01');
      expect(normalized.getFullYear()).toBe(2026);
      expect(normalized.getMonth()).toBe(0);
      expect(normalized.getDate()).toBe(1);
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

    it('swaps inverted minDate and maxDate safely', () => {
      const minDate = new Date(2026, 7, 21); // 20 days after today
      const maxDate = new Date(2026, 6, 22); // 10 days before today

      const { minOffset, maxOffset } = computeDayRange(todayTime, minDate, maxDate);
      expect(minOffset).toBe(-10);
      expect(maxOffset).toBe(20);
    });
  });
});

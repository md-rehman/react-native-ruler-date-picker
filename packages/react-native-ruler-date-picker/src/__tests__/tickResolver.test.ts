import { matchesCondition, resolveTick } from '../tickResolver';
import { resolveTickRules, DEFAULT_CALENDAR_TICKS, DEFAULT_METRIC_TICKS, DEFAULT_MINIMAL_TICKS } from '../presets';
import { LIGHT_THEME } from '../defaults';
import type { TickContext, TickRule } from '../types';

describe('Tick Resolver & Presets', () => {
  const baseContext: TickContext = {
    date: new Date(2026, 9, 11), // October 11, 2026 (Sunday)
    offset: 0,
    isToday: true,
    isSelected: true,
    isInRange: false,
  };

  describe('matchesCondition', () => {
    it('matches daily and undefined unconditionally', () => {
      expect(matchesCondition(undefined, baseContext)).toBe(true);
      expect(matchesCondition('daily', baseContext)).toBe(true);
    });

    it('matches weekly when offset is multiple of 7', () => {
      expect(matchesCondition('weekly', { ...baseContext, offset: 0 })).toBe(true);
      expect(matchesCondition('weekly', { ...baseContext, offset: 7 })).toBe(true);
      expect(matchesCondition('weekly', { ...baseContext, offset: -14 })).toBe(true);
      expect(matchesCondition('weekly', { ...baseContext, offset: 3 })).toBe(false);
    });

    it('matches monthly on the first day of month', () => {
      const firstOfMonth = new Date(2026, 9, 1);
      const otherDay = new Date(2026, 9, 15);

      expect(matchesCondition('monthly', { ...baseContext, date: firstOfMonth })).toBe(true);
      expect(matchesCondition('monthly', { ...baseContext, date: otherDay })).toBe(false);
    });

    it('matches yearly on Jan 1', () => {
      const jan1 = new Date(2026, 0, 1);
      const feb1 = new Date(2026, 1, 1);

      expect(matchesCondition('yearly', { ...baseContext, date: jan1 })).toBe(true);
      expect(matchesCondition('yearly', { ...baseContext, date: feb1 })).toBe(false);
    });

    it('matches interval object', () => {
      expect(matchesCondition({ interval: 5 }, { ...baseContext, offset: 10 })).toBe(true);
      expect(matchesCondition({ interval: 5 }, { ...baseContext, offset: 12 })).toBe(false);
    });

    it('matches dayOfWeek array', () => {
      // 2026-10-11 is Sunday (day 0)
      expect(matchesCondition({ dayOfWeek: [0, 6] }, baseContext)).toBe(true);
      expect(matchesCondition({ dayOfWeek: [1, 2, 3] }, baseContext)).toBe(false);
    });

    it('delegates to custom function predicate', () => {
      const customFn = (ctx: TickContext) => ctx.offset === 42;
      expect(matchesCondition(customFn, { ...baseContext, offset: 42 })).toBe(true);
      expect(matchesCondition(customFn, { ...baseContext, offset: 10 })).toBe(false);
    });
  });

  describe('resolveTick', () => {
    const rules: TickRule[] = [
      {
        condition: 'monthly',
        height: 32,
        width: 4,
        color: '#FF0000',
        label: { format: () => '1st', color: '#FF0000' },
      },
      {
        condition: { dayOfWeek: [0, 6] },
        height: 20,
        color: '#00FF00',
      },
      {
        condition: 'daily',
        height: 12,
        color: '#0000FF',
      },
    ];

    it('applies the first matching rule (cascade priority)', () => {
      // Oct 1 is Thursday (day 4), matches monthly first
      const oct1 = new Date(2026, 9, 1);
      const oct1Context: TickContext = {
        date: oct1,
        offset: -10,
        isToday: false,
        isSelected: false,
      };

      const resolved = resolveTick(oct1Context, rules, LIGHT_THEME);
      expect(resolved.height).toBe(32);
      expect(resolved.width).toBe(4);
      expect(resolved.color).toBe('#FF0000');
      expect(resolved.labelText).toBe('1st');
    });

    it('falls back to second rule when first does not match', () => {
      // Oct 11 is Sunday (day 0), matches weekends rule
      const resolved = resolveTick(baseContext, rules, LIGHT_THEME);
      expect(resolved.height).toBe(20);
      expect(resolved.color).toBe('#00FF00');
    });

    it('shows today dot when isToday is true by default', () => {
      const resolved = resolveTick(baseContext, rules, LIGHT_THEME);
      expect(resolved.hasDot).toBe(true);
      expect(resolved.dotColor).toBe(LIGHT_THEME.accentColor);
    });

    it('respects defaultWidth when rule width is omitted', () => {
      // rule 2 (weekends) does not specify width
      const resolvedDefault = resolveTick(baseContext, rules, LIGHT_THEME);
      expect(resolvedDefault.width).toBe(3);

      const resolvedCustom = resolveTick(baseContext, rules, LIGHT_THEME, 5);
      expect(resolvedCustom.width).toBe(5);
    });
  });

  describe('resolveTickRules preset helper', () => {
    it('returns default calendar ticks for empty or "calendar"', () => {
      expect(resolveTickRules()).toBe(DEFAULT_CALENDAR_TICKS);
      expect(resolveTickRules('calendar')).toBe(DEFAULT_CALENDAR_TICKS);
    });

    it('returns metric ticks for "metric"', () => {
      expect(resolveTickRules('metric')).toBe(DEFAULT_METRIC_TICKS);
    });

    it('returns minimal ticks for "minimal"', () => {
      expect(resolveTickRules('minimal')).toBe(DEFAULT_MINIMAL_TICKS);
    });

    it('returns custom array when passed directly', () => {
      const custom: TickRule[] = [{ height: 25 }];
      expect(resolveTickRules(custom)).toBe(custom);
    });
  });
});

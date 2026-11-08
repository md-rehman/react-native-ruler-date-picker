import type { TickRule } from './types';

/**
 * Calendar preset:
 * - 1st of month: tall (30px), bold, month name + day label
 * - Weekly (every 7th day): medium-tall (24px), labeled with day number
 * - Weekends (Saturday & Sunday): medium (18px)
 * - Base daily ticks: short (12px)
 */
export const DEFAULT_CALENDAR_TICKS: TickRule[] = [
  {
    condition: 'monthly',
    height: 30,
    width: 3.5,
    label: {
      format: (d) =>
        d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      fontWeight: '700',
    },
  },
  {
    condition: 'weekly',
    height: 24,
    width: 3,
    label: {
      format: (d) => `${d.getDate()}`,
      fontWeight: '600',
    },
  },
  {
    condition: { dayOfWeek: [0, 6] },
    height: 18,
    width: 2.5,
  },
  {
    // Catch-all daily fallback
    condition: 'daily',
    height: 12,
    width: 2,
  },
];

/**
 * Metric preset:
 * - Every 10th day: tall (28px), labeled
 * - Every 5th day: medium (18px)
 * - Daily: short (12px)
 */
export const DEFAULT_METRIC_TICKS: TickRule[] = [
  {
    condition: { interval: 10 },
    height: 28,
    width: 3.5,
    label: {
      format: (d) => `${d.getDate()}`,
      fontWeight: '600',
    },
  },
  {
    condition: { interval: 5 },
    height: 18,
    width: 2.5,
  },
  {
    condition: 'daily',
    height: 12,
    width: 2,
  },
];

/**
 * Minimal preset:
 * - Weekly (7-day): tall (24px), labeled
 * - Daily: short (12px)
 */
export const DEFAULT_MINIMAL_TICKS: TickRule[] = [
  {
    condition: 'weekly',
    height: 24,
    width: 3,
    label: {
      format: (d) => `${d.getDate()}`,
    },
  },
  {
    condition: 'daily',
    height: 12,
    width: 2,
  },
];

/**
 * Resolves a tick configuration prop (preset string or rule array) into an array of TickRule objects.
 */
export function resolveTickRules(
  ticks?: TickRule[] | 'calendar' | 'metric' | 'minimal'
): TickRule[] {
  if (Array.isArray(ticks)) {
    return ticks;
  }
  if (ticks === 'metric') {
    return DEFAULT_METRIC_TICKS;
  }
  if (ticks === 'minimal') {
    return DEFAULT_MINIMAL_TICKS;
  }
  return DEFAULT_CALENDAR_TICKS;
}

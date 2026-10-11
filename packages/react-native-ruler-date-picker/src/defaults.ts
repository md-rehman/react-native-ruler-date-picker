import type { ResolvedRulerTheme } from './types';

// ── Internal constants (not user-configurable) ───────────────────────────
export const MS_PER_DAY = 86_400_000;
export const DEFAULT_DAY_RANGE = 365;

// ── User-configurable defaults ───────────────────────────────────────────
export const DEFAULTS = {
  tickSpacing: 24,
  tickThickness: 3,
  height: 120,
  rulerHeight: 60,
  indicatorWidth: 2,
  indicatorHeight: 40,
  todayDotSize: 6,
  bufferTicks: 10,
  debounceMs: 100,
  fastSwipeTickThreshold: 1,
  continuousHapticIntervalMs: 20,
  enableHaptics: true,
  showResetToToday: false,
  showHeader: true,
} as const;

// ── Default color palettes ───────────────────────────────────────────────
export const LIGHT_THEME: ResolvedRulerTheme = {
  background: 'transparent',
  indicatorColor: '#3B82F6',
  accentColor: '#3B82F6',
  labelColor: '#6B7280',
  defaultTickColor: '#D1D5DB',
  rangeHighlightColor: 'rgba(59, 130, 246, 0.15)',
};

export const DARK_THEME: ResolvedRulerTheme = {
  background: 'transparent',
  indicatorColor: '#60A5FA',
  accentColor: '#60A5FA',
  labelColor: '#9CA3AF',
  defaultTickColor: '#4B5563',
  rangeHighlightColor: 'rgba(96, 165, 250, 0.2)',
};

import type { ResolvedColors } from './types';

// ── Internal constants (not user-configurable) ───────────────────────────
export const MS_PER_DAY = 86_400_000;
export const DEFAULT_DAY_RANGE = 365;

// ── User-configurable defaults ───────────────────────────────────────────
export const DEFAULTS = {
  tickSpacing: 24,
  tickHeight: 12,
  tickTallHeight: 24,
  tickThickness: 4,
  height: 120,
  rulerHeight: 60,
  indicatorWidth: 2,
  indicatorHeight: 40,
  todayDotSize: 6,
  labelFontSize: 10,
  bufferTicks: 10,
  updateDebounceMs: 100,
  fastSwipeTickThreshold: 1,
  continuousHapticIntervalMs: 20,
  enableHaptics: true,
  showResetToToday: false,
} as const;

// ── Default color palettes ───────────────────────────────────────────────
export const LIGHT_COLORS: ResolvedColors = {
  tickColor: '#D1D5DB',
  tickTallColor: '#9CA3AF',
  labelColor: '#6B7280',
  accentColor: '#3B82F6',
  indicatorColor: '#3B82F6',
  backgroundColor: 'transparent',
};

export const DARK_COLORS: ResolvedColors = {
  tickColor: '#4B5563',
  tickTallColor: '#6B7280',
  labelColor: '#9CA3AF',
  accentColor: '#60A5FA',
  indicatorColor: '#60A5FA',
  backgroundColor: 'transparent',
};

import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { useWindowDimensions } from 'react-native';
import {
  useSharedValue,
  withDecay,
  withTiming,
  useAnimatedReaction,
  runOnJS,
  type SharedValue,
} from 'react-native-reanimated';
import { Gesture, type PanGesture } from 'react-native-gesture-handler';

import type {
  RulerDatePickerProps,
  ResolvedTick,
  ResolvedRulerTheme,
} from './types';
import { DEFAULTS, MS_PER_DAY } from './defaults';
import { resolveTickRules } from './presets';
import { resolveTick } from './tickResolver';
import {
  formatDateString,
  normalizeDate,
  dateToDayOffset,
  dayOffsetToDate,
  computeDayRange,
  useResolvedTheme,
} from './utils';
import { useHaptics } from './useHaptics';

export interface UseRulerDatePickerReturn {
  // Animated values
  translateX: SharedValue<number>;
  panGesture: PanGesture;

  // Selected State
  selectedDate: Date;
  selectedDateStr: string;
  isTodaySelected: boolean;

  // Resolved ticks
  visibleTicks: ResolvedTick[];

  // Resolved Theme & Layout
  theme: ResolvedRulerTheme;
  tickSpacing: number;
  rulerHeight: number;
  height: number;
  width: number;
  minOffset: number;
  maxOffset: number;

  // Actions
  scrollToDate: (targetDate: Date | string, animated?: boolean) => void;
  resetToToday: (animated?: boolean) => void;
}

/**
 * Headless Hook encapsulating gesture physics, Reanimated 3 decay/snapping,
 * windowed tick resolution, and haptics for the Ruler Date Picker.
 */
export function useRulerDatePicker(
  props: RulerDatePickerProps = {}
): UseRulerDatePickerReturn {
  const {
    value,
    defaultValue,
    onChange,
    minDate,
    maxDate,
    ticks = 'calendar',
    tickSpacing = DEFAULTS.tickSpacing,
    tickWidth = DEFAULTS.tickWidth,
    rulerHeight = DEFAULTS.rulerHeight,
    theme: propTheme,
    debounceMs = DEFAULTS.debounceMs,
    haptics = true,
    style,
  } = props;

  const bufferTicks = DEFAULTS.bufferTicks;
  const isHapticsEnabled = typeof haptics === 'boolean' ? haptics : (haptics?.enabled ?? true);
  const resolvedHapticTrigger = typeof haptics === 'object' ? haptics.onTrigger : undefined;
  const fastSwipeTickThreshold = (typeof haptics === 'object' ? haptics.fastSwipeTickThreshold : undefined) ?? DEFAULTS.fastSwipeTickThreshold;
  const continuousHapticIntervalMs = (typeof haptics === 'object' ? haptics.continuousHapticIntervalMs : undefined) ?? DEFAULTS.continuousHapticIntervalMs;
  const height = (style as any)?.height ?? DEFAULTS.height;

  // ── Resolved Theme ────────────────────────────────────────────────────────
  const theme = useResolvedTheme(propTheme);

  // ── Resolved Rules ────────────────────────────────────────────────────────
  const rules = useMemo(() => resolveTickRules(ticks), [ticks]);

  // ── Haptics ───────────────────────────────────────────────────────────────
  const { fireDiscreteHaptic, startContinuousHaptic, stopContinuousHaptic } =
    useHaptics({
      enableHaptics: isHapticsEnabled,
      onHapticTrigger: resolvedHapticTrigger,
      continuousHapticIntervalMs,
    });

  // ── Reference Time (Midnight Today) ───────────────────────────────────────
  const todayTime = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  }, []);

  // ── Bounds ────────────────────────────────────────────────────────────────
  const { minOffset, maxOffset } = useMemo(
    () => computeDayRange(todayTime, minDate, maxDate),
    [todayTime, minDate, maxDate]
  );

  // ── Initial Date Calculation ──────────────────────────────────────────────
  const initialDate = useMemo(() => {
    return normalizeDate(value ?? defaultValue ?? new Date());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initialOffsetDays = useMemo(() => {
    return dateToDayOffset(initialDate, todayTime);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Animated Values ───────────────────────────────────────────────────────
  const translateX = useSharedValue(-initialOffsetDays * tickSpacing);
  const contextX = useSharedValue(0);
  const previousIndex = useSharedValue(-initialOffsetDays);
  const isFastMode = useSharedValue(false);

  // ── State ─────────────────────────────────────────────────────────────────
  const [selectedDate, setSelectedDate] = useState<Date>(initialDate);
  const [selectedDateStr, setSelectedDateStr] = useState<string>(
    formatDateString(initialDate)
  );
  const [windowCenter, setWindowCenter] = useState<number>(-initialOffsetDays);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const windowDimensions = useWindowDimensions();
  const width = props.width ?? windowDimensions.width;

  const halfVisible = Math.ceil(width / 2 / tickSpacing);
  const windowSize = halfVisible + bufferTicks;

  // ── Visible Ticks Resolution ──────────────────────────────────────────────
  const visibleTicks = useMemo(() => {
    const resolved: ResolvedTick[] = [];
    const start = Math.max(windowCenter - windowSize, minOffset);
    const end = Math.min(windowCenter + windowSize, maxOffset);

    for (let i = start; i <= end; i++) {
      const d = dayOffsetToDate(i, todayTime);
      const isToday = i === 0;
      const isSelected = formatDateString(d) === selectedDateStr;

      resolved.push(
        resolveTick(
          {
            date: d,
            offset: i,
            isToday,
            isSelected,
          },
          rules,
          theme,
          tickWidth
        )
      );
    }
    return resolved;
  }, [
    windowCenter,
    windowSize,
    minOffset,
    maxOffset,
    todayTime,
    selectedDateStr,
    rules,
    theme,
    tickWidth,
  ]);

  // ── Tick Changed Callback ─────────────────────────────────────────────────
  const onTickChanged = useCallback(
    (index: number, enteringFastMode: boolean) => {
      if (enteringFastMode) {
        startContinuousHaptic();
      } else {
        stopContinuousHaptic();
        fireDiscreteHaptic();
      }

      const d = dayOffsetToDate(index, todayTime);
      const dateStr = formatDateString(d);

      setSelectedDate(d);
      setSelectedDateStr(dateStr);

      setWindowCenter((prev) => {
        if (Math.abs(index - prev) >= 5) {
          return index;
        }
        return prev;
      });

      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      debounceTimerRef.current = setTimeout(() => {
        onChange?.(d, dateStr);
      }, debounceMs);
    },
    [
      todayTime,
      onChange,
      debounceMs,
      startContinuousHaptic,
      stopContinuousHaptic,
      fireDiscreteHaptic,
    ]
  );

  // ── Animation Settled Callback ────────────────────────────────────────────
  const onAnimationSettled = useCallback(
    (index: number) => {
      stopContinuousHaptic();
      fireDiscreteHaptic();

      const d = dayOffsetToDate(index, todayTime);
      const dateStr = formatDateString(d);

      setSelectedDate(d);
      setSelectedDateStr(dateStr);
      setWindowCenter(index);

      onChange?.(d, dateStr);
    },
    [todayTime, onChange, stopContinuousHaptic, fireDiscreteHaptic]
  );

  // ── Animated Reaction ─────────────────────────────────────────────────────
  useAnimatedReaction(
    () => Math.round(-translateX.value / tickSpacing),
    (index, prev) => {
      if (index !== prev && index >= minOffset && index <= maxOffset) {
        previousIndex.value = index;
        const ticksSkipped = prev !== null ? Math.abs(index - prev) : 1;
        const shouldBeFast = ticksSkipped > fastSwipeTickThreshold;

        if (shouldBeFast && !isFastMode.value) {
          isFastMode.value = true;
          runOnJS(onTickChanged)(index, true);
        } else if (!shouldBeFast && isFastMode.value) {
          isFastMode.value = false;
          runOnJS(onTickChanged)(index, false);
        } else if (!shouldBeFast) {
          runOnJS(onTickChanged)(index, false);
        }
        if (shouldBeFast && isFastMode.value) {
          runOnJS(onTickChanged)(index, true);
        }
      }
    },
    [tickSpacing, minOffset, maxOffset, fastSwipeTickThreshold]
  );

  // ── Pan Gesture ───────────────────────────────────────────────────────────
  const panGesture = useMemo(() => {
    return Gesture.Pan()
      .onStart(() => {
        contextX.value = translateX.value;
      })
      .onUpdate((event) => {
        translateX.value = contextX.value + event.translationX;
      })
      .onEnd((event) => {
        translateX.value = withDecay(
          {
            velocity: event.velocityX,
            deceleration: 0.99,
          },
          (finished) => {
            if (finished) {
              const maxTranslateX = -minOffset * tickSpacing;
              const minTranslateX = -maxOffset * tickSpacing;
              const clampedX = Math.min(
                Math.max(translateX.value, minTranslateX),
                maxTranslateX
              );
              const snappedIndex = Math.round(clampedX / tickSpacing);
              const snappedX = snappedIndex * tickSpacing;

              translateX.value = withTiming(
                snappedX,
                { duration: 150 },
                (done) => {
                  if (done) {
                    isFastMode.value = false;
                    const index = Math.round(-snappedX / tickSpacing);
                    runOnJS(onAnimationSettled)(index);
                  }
                }
              );
            }
          }
        );
      });
  }, [contextX, translateX, minOffset, maxOffset, tickSpacing, onAnimationSettled, isFastMode]);

  // ── Programmatic Control ──────────────────────────────────────────────────
  const scrollToDate = useCallback(
    (targetDate: Date | string, animated: boolean = true) => {
      const d = normalizeDate(targetDate);
      const offset = dateToDayOffset(d, todayTime);
      const clampedOffset = Math.max(minOffset, Math.min(offset, maxOffset));
      const targetX = -clampedOffset * tickSpacing;

      stopContinuousHaptic();
      if (animated) {
        translateX.value = withTiming(targetX, { duration: 250 }, (done) => {
          if (done) {
            runOnJS(onAnimationSettled)(clampedOffset);
          }
        });
      } else {
        translateX.value = targetX;
        onAnimationSettled(clampedOffset);
      }
    },
    [todayTime, minOffset, maxOffset, tickSpacing, translateX, stopContinuousHaptic, onAnimationSettled]
  );

  const resetToToday = useCallback(
    (animated: boolean = true) => {
      scrollToDate(new Date(todayTime), animated);
    },
    [scrollToDate, todayTime]
  );

  // ── Sync with external controlled value ───────────────────────────────────
  const prevValuePropRef = useRef(value);
  useEffect(() => {
    if (value !== undefined && value !== prevValuePropRef.current) {
      prevValuePropRef.current = value;
      const target = normalizeDate(value);
      if (formatDateString(target) !== formatDateString(selectedDate)) {
        scrollToDate(target, true);
      }
    }
  }, [value, selectedDate, scrollToDate]);

  const isTodaySelected = useMemo(() => {
    return selectedDateStr === formatDateString(new Date(todayTime));
  }, [selectedDateStr, todayTime]);

  return {
    translateX,
    panGesture,
    selectedDate,
    selectedDateStr,
    isTodaySelected,
    visibleTicks,
    theme,
    tickSpacing,
    rulerHeight,
    height,
    width,
    minOffset,
    maxOffset,
    scrollToDate,
    resetToToday,
  };
}

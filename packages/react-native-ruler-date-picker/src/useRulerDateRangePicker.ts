import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { Dimensions } from 'react-native';
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
  RulerDateRangePickerProps,
  ResolvedTick,
  ResolvedRulerTheme,
  DateRangeChangePayload,
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

const SCREEN_WIDTH = Dimensions.get('window').width;

export interface UseRulerDateRangePickerReturn {
  translateX: SharedValue<number>;
  panGesture: PanGesture;

  // Range State
  startDate: Date;
  endDate: Date;
  startDateStr: string;
  endDateStr: string;
  startOffset: number;
  endOffset: number;
  spanDays: number;
  activeHandle: 'start' | 'end';
  setActiveHandle: (handle: 'start' | 'end') => void;

  // Resolved ticks & layout
  visibleTicks: ResolvedTick[];
  theme: ResolvedRulerTheme;
  tickSpacing: number;
  rulerHeight: number;
  height: number;
  minOffset: number;
  maxOffset: number;

  // Actions
  scrollToHandle: (handle: 'start' | 'end', animated?: boolean) => void;
  setRange: (start: Date | string, end: Date | string) => void;
}

/**
 * Headless Hook for managing Date Range selection with dual pins,
 * range highlight calculations, and Reanimated 3 physics.
 */
export function useRulerDateRangePicker(
  props: RulerDateRangePickerProps = {}
): UseRulerDateRangePickerReturn {
  const {
    value,
    defaultValue,
    onChange,
    minDate,
    maxDate,
    ticks = 'calendar',
    tickSpacing = DEFAULTS.tickSpacing,
    tickThickness = DEFAULTS.tickThickness,
    rulerHeight = DEFAULTS.rulerHeight,
    theme: propTheme,
    debounceMs = DEFAULTS.debounceMs,
    haptics = true,
    minSpanDays = 1,
    maxSpanDays,
    style,
  } = props;

  const bufferTicks = DEFAULTS.bufferTicks;
  const isHapticsEnabled = typeof haptics === 'boolean' ? haptics : (haptics?.enabled ?? true);
  const resolvedHapticTrigger = typeof haptics === 'object' ? haptics.onTrigger : undefined;
  const fastSwipeTickThreshold = (typeof haptics === 'object' ? haptics.fastSwipeTickThreshold : undefined) ?? DEFAULTS.fastSwipeTickThreshold;
  const continuousHapticIntervalMs = (typeof haptics === 'object' ? haptics.continuousHapticIntervalMs : undefined) ?? DEFAULTS.continuousHapticIntervalMs;
  const height = (style as any)?.height ?? DEFAULTS.height;

  const theme = useResolvedTheme(propTheme);
  const rules = useMemo(() => resolveTickRules(ticks), [ticks]);

  const { fireDiscreteHaptic, startContinuousHaptic, stopContinuousHaptic } =
    useHaptics({
      enableHaptics: isHapticsEnabled,
      onHapticTrigger: resolvedHapticTrigger,
      continuousHapticIntervalMs,
    });

  const todayTime = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  }, []);

  const { minOffset, maxOffset } = useMemo(
    () => computeDayRange(todayTime, minDate, maxDate),
    [todayTime, minDate, maxDate]
  );

  // ── Initial Dates ─────────────────────────────────────────────────────────
  const initialStartDate = useMemo(() => {
    if (value?.start) return normalizeDate(value.start);
    if (defaultValue?.start) return normalizeDate(defaultValue.start);
    return new Date(todayTime);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initialEndDate = useMemo(() => {
    if (value?.end) return normalizeDate(value.end);
    if (defaultValue?.end) return normalizeDate(defaultValue.end);
    const end = new Date(todayTime);
    end.setDate(end.getDate() + 7);
    return end;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [activeHandle, setActiveHandle] = useState<'start' | 'end'>('start');
  const [startDate, setStartDate] = useState<Date>(initialStartDate);
  const [endDate, setEndDate] = useState<Date>(initialEndDate);

  const startOffset = useMemo(
    () => dateToDayOffset(startDate, todayTime),
    [startDate, todayTime]
  );
  const endOffset = useMemo(
    () => dateToDayOffset(endDate, todayTime),
    [endDate, todayTime]
  );

  const activeOffset = activeHandle === 'start' ? startOffset : endOffset;

  // ── Shared Values ─────────────────────────────────────────────────────────
  const translateX = useSharedValue(-activeOffset * tickSpacing);
  const contextX = useSharedValue(0);
  const previousIndex = useSharedValue(-activeOffset);
  const isFastMode = useSharedValue(false);

  const [windowCenter, setWindowCenter] = useState<number>(-activeOffset);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const halfVisible = Math.ceil(SCREEN_WIDTH / 2 / tickSpacing);
  const windowSize = halfVisible + bufferTicks;

  // ── Visible Ticks Resolution ──────────────────────────────────────────────
  const visibleTicks = useMemo(() => {
    const resolved: ResolvedTick[] = [];
    const start = Math.max(windowCenter - windowSize, minOffset);
    const end = Math.min(windowCenter + windowSize, maxOffset);

    for (let i = start; i <= end; i++) {
      const d = dayOffsetToDate(i, todayTime);
      const isToday = i === 0;
      const isSelected = i === startOffset || i === endOffset;
      const isInRange = i >= startOffset && i <= endOffset;

      resolved.push(
        resolveTick(
          {
            date: d,
            offset: i,
            isToday,
            isSelected,
            isInRange,
          },
          rules,
          theme,
          tickThickness
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
    startOffset,
    endOffset,
    rules,
    theme,
    tickThickness,
  ]);

  // ── Notify Change ─────────────────────────────────────────────────────────
  const emitChange = useCallback(
    (newStart: Date, newEnd: Date) => {
      const payload: DateRangeChangePayload = {
        startDate: newStart,
        endDate: newEnd,
        startString: formatDateString(newStart),
        endString: formatDateString(newEnd),
      };
      onChange?.(payload);
    },
    [onChange]
  );

  // ── Tick Changed Callback ─────────────────────────────────────────────────
  const onTickChanged = useCallback(
    (index: number, enteringFastMode: boolean) => {
      if (enteringFastMode) {
        startContinuousHaptic();
      } else {
        stopContinuousHaptic();
        fireDiscreteHaptic();
      }

      setWindowCenter((prev) => {
        if (Math.abs(index - prev) >= 5) {
          return index;
        }
        return prev;
      });

      const targetDate = dayOffsetToDate(index, todayTime);

      if (activeHandle === 'start') {
        const clampedIndex = Math.min(index, endOffset - minSpanDays);
        const validStart = dayOffsetToDate(clampedIndex, todayTime);
        setStartDate(validStart);

        if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = setTimeout(() => {
          emitChange(validStart, endDate);
        }, debounceMs);
      } else {
        const clampedIndex = Math.max(index, startOffset + minSpanDays);
        const validEnd = dayOffsetToDate(clampedIndex, todayTime);
        setEndDate(validEnd);

        if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = setTimeout(() => {
          emitChange(startDate, validEnd);
        }, debounceMs);
      }
    },
    [
      activeHandle,
      endOffset,
      startOffset,
      minSpanDays,
      todayTime,
      endDate,
      startDate,
      emitChange,
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
      setWindowCenter(index);

      if (activeHandle === 'start') {
        const clampedIndex = Math.min(index, endOffset - minSpanDays);
        const validStart = dayOffsetToDate(clampedIndex, todayTime);
        setStartDate(validStart);
        emitChange(validStart, endDate);
      } else {
        const clampedIndex = Math.max(index, startOffset + minSpanDays);
        const validEnd = dayOffsetToDate(clampedIndex, todayTime);
        setEndDate(validEnd);
        emitChange(startDate, validEnd);
      }
    },
    [
      activeHandle,
      endOffset,
      startOffset,
      minSpanDays,
      todayTime,
      endDate,
      startDate,
      emitChange,
      stopContinuousHaptic,
      fireDiscreteHaptic,
    ]
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

  // ── Switch Active Handle ──────────────────────────────────────────────────
  const scrollToHandle = useCallback(
    (handle: 'start' | 'end', animated: boolean = true) => {
      setActiveHandle(handle);
      const targetOffset = handle === 'start' ? startOffset : endOffset;
      const targetX = -targetOffset * tickSpacing;

      stopContinuousHaptic();
      if (animated) {
        translateX.value = withTiming(targetX, { duration: 250 }, (done) => {
          if (done) {
            runOnJS(setWindowCenter)(targetOffset);
          }
        });
      } else {
        translateX.value = targetX;
        setWindowCenter(targetOffset);
      }
    },
    [startOffset, endOffset, tickSpacing, translateX, stopContinuousHaptic]
  );

  const setRange = useCallback(
    (startInput: Date | string, endInput: Date | string) => {
      const s = normalizeDate(startInput);
      const e = normalizeDate(endInput);
      setStartDate(s);
      setEndDate(e);
      emitChange(s, e);
    },
    [emitChange]
  );

  // Sync external controlled range
  useEffect(() => {
    if (value?.start && value?.end) {
      const s = normalizeDate(value.start);
      const e = normalizeDate(value.end);
      if (
        formatDateString(s) !== formatDateString(startDate) ||
        formatDateString(e) !== formatDateString(endDate)
      ) {
        setStartDate(s);
        setEndDate(e);
      }
    }
  }, [value, startDate, endDate]);

  const spanDays = Math.max(0, endOffset - startOffset);

  return {
    translateX,
    panGesture,
    startDate,
    endDate,
    startDateStr: formatDateString(startDate),
    endDateStr: formatDateString(endDate),
    startOffset,
    endOffset,
    spanDays,
    activeHandle,
    setActiveHandle,
    visibleTicks,
    theme,
    tickSpacing,
    rulerHeight,
    height,
    minOffset,
    maxOffset,
    scrollToHandle,
    setRange,
  };
}

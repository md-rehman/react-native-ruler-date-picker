import React, { useState, useRef, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDecay,
  withTiming,
  useAnimatedReaction,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

import type { RulerDatePickerProps, TickData } from './types';
import { DEFAULTS, MS_PER_DAY } from './defaults';
import {
  formatDateString,
  dateToDayOffset,
  dayOffsetToDate,
  useResolvedColors,
  shouldShowLabel,
  computeDayRange,
} from './utils';
import { useHaptics } from './useHaptics';
import { Tick } from './Tick';

const SCREEN_WIDTH = Dimensions.get('window').width;

/**
 * A performant, customizable ruler-style date picker for React Native.
 *
 * Features:
 * - 60 FPS scrolling via Reanimated 3 decay physics + snap alignment
 * - Dual-speed haptic feedback engine (discrete ticks vs continuous buzz)
 * - Windowed tick rendering for memory efficiency
 * - Fully configurable dimensions, colors, and behaviors
 *
 * @example
 * ```tsx
 * <RulerDatePicker
 *   selectedDate={new Date()}
 *   onSelectDate={(date, dateString) => console.log(dateString)}
 * />
 * ```
 */
export function RulerDatePicker(props: RulerDatePickerProps) {
  const {
    selectedDate,
    onSelectDate,
    minDate,
    maxDate,
    labelInterval,
    highlightDays,
    tickSpacing = DEFAULTS.tickSpacing,
    tickHeight = DEFAULTS.tickHeight,
    tickTallHeight = DEFAULTS.tickTallHeight,
    tickThickness = DEFAULTS.tickThickness,
    height = DEFAULTS.height,
    rulerHeight = DEFAULTS.rulerHeight,
    indicatorWidth = DEFAULTS.indicatorWidth,
    indicatorHeight = DEFAULTS.indicatorHeight,
    todayDotSize = DEFAULTS.todayDotSize,
    labelFontSize = DEFAULTS.labelFontSize,
    bufferTicks = DEFAULTS.bufferTicks,
    updateDebounceMs = DEFAULTS.updateDebounceMs,
    enableHaptics = DEFAULTS.enableHaptics,
    onHapticTrigger,
    fastSwipeTickThreshold = DEFAULTS.fastSwipeTickThreshold,
    continuousHapticIntervalMs = DEFAULTS.continuousHapticIntervalMs,
    showResetToToday = DEFAULTS.showResetToToday,
    renderHeader,
  } = props;

  // ── Resolve colors ──────────────────────────────────────────────────────
  const colors = useResolvedColors(props);

  // ── Haptics ─────────────────────────────────────────────────────────────
  const { fireDiscreteHaptic, startContinuousHaptic, stopContinuousHaptic } =
    useHaptics({
      enableHaptics,
      onHapticTrigger,
      continuousHapticIntervalMs,
    });

  // ── Reference time (midnight today) ─────────────────────────────────────
  const todayTime = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  }, []);

  // ── Date boundaries ─────────────────────────────────────────────────────
  const { minOffset, maxOffset } = useMemo(
    () => computeDayRange(todayTime, minDate, maxDate),
    [todayTime, minDate, maxDate]
  );

  // ── Initial offset from today ───────────────────────────────────────────
  const initialOffsetDays = useMemo(() => {
    return dateToDayOffset(selectedDate, todayTime);
    // Intentionally only computed once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const halfVisible = Math.ceil(SCREEN_WIDTH / 2 / tickSpacing);
  const windowSize = halfVisible + bufferTicks;

  // ── Animated values ─────────────────────────────────────────────────────
  const translateX = useSharedValue(-initialOffsetDays * tickSpacing);
  const contextX = useSharedValue(0);
  const previousIndex = useSharedValue(-initialOffsetDays);
  const isFastMode = useSharedValue(false);

  // ── State ───────────────────────────────────────────────────────────────
  const initialDateStr = useMemo(() => {
    const d =
      typeof selectedDate === 'string'
        ? new Date(selectedDate)
        : new Date(selectedDate);
    d.setHours(0, 0, 0, 0);
    return formatDateString(d);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [displayDateStr, setDisplayDateStr] = useState(initialDateStr);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [windowCenter, setWindowCenter] = useState(-initialOffsetDays);

  // ── Visible ticks (windowed rendering) ──────────────────────────────────
  const visibleTicks = useMemo(() => {
    const ticks: TickData[] = [];

    const start = Math.max(windowCenter - windowSize, minOffset);
    const end = Math.min(windowCenter + windowSize, maxOffset);

    for (let i = start; i <= end; i++) {
      const d = new Date(todayTime + i * MS_PER_DAY);
      ticks.push({
        offset: i,
        isLabeled: shouldShowLabel(d, labelInterval, todayTime),
        isToday: i === 0,
        isHighlighted: highlightDays
          ? highlightDays.includes(d.getDay())
          : false,
        dateStr: d.getDate().toString(),
      });
    }
    return ticks;
  }, [
    windowCenter,
    windowSize,
    todayTime,
    minOffset,
    maxOffset,
    labelInterval,
    highlightDays,
  ]);

  // ── Tick change callbacks ───────────────────────────────────────────────

  const onTickChanged = useCallback(
    (index: number, enteringFastMode: boolean) => {
      if (enteringFastMode) {
        startContinuousHaptic();
      } else {
        stopContinuousHaptic();
        fireDiscreteHaptic();
      }

      // Update display date
      const d = dayOffsetToDate(index, todayTime);
      const dateStr = formatDateString(d);
      setWindowCenter((prevCenter) => {
        if (Math.abs(index - prevCenter) >= 5) {
          return index;
        }
        return prevCenter;
      });

      // Debounce the heavy onSelectDate callback
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      debounceTimerRef.current = setTimeout(() => {
        onSelectDate(d, dateStr);
      }, updateDebounceMs);
    },
    [
      todayTime,
      onSelectDate,
      updateDebounceMs,
      startContinuousHaptic,
      stopContinuousHaptic,
      fireDiscreteHaptic,
    ]
  );

  const onAnimationSettled = useCallback(
    (index: number) => {
      stopContinuousHaptic();
      fireDiscreteHaptic();
      const d = dayOffsetToDate(index, todayTime);
      const dateStr = formatDateString(d);
      setDisplayDateStr(dateStr);
      setWindowCenter(index);
      onSelectDate(d, dateStr);
    },
    [todayTime, onSelectDate, stopContinuousHaptic, fireDiscreteHaptic]
  );

  // ── Animated reaction ───────────────────────────────────────────────────
  useAnimatedReaction(
    () => Math.round(-translateX.value / tickSpacing),
    (index, prev) => {
      if (
        index !== prev &&
        index >= minOffset &&
        index <= maxOffset
      ) {
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

  // ── Pan gesture ─────────────────────────────────────────────────────────
  const pan = Gesture.Pan()
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

  const animatedStyle = useAnimatedStyle(
    () => ({
      transform: [{ translateX: translateX.value }],
    }),
    [translateX]
  );

  // ── Header ──────────────────────────────────────────────────────────────
  const displayDate = new Date(displayDateStr);
  const displayFormat = displayDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
  const displayYear = displayDate.getFullYear();
  const currentYear = new Date().getFullYear();
  const showYear = displayYear !== currentYear;
  const isTodaySelected =
    displayDateStr === formatDateString(new Date(todayTime));

  const handleResetToToday = useCallback(() => {
    stopContinuousHaptic();
    translateX.value = withTiming(0, { duration: 300 });
    const todayStr = formatDateString(new Date(todayTime));
    setDisplayDateStr(todayStr);
    setWindowCenter(0);
    onSelectDate(new Date(todayTime), todayStr);
  }, [todayTime, onSelectDate, stopContinuousHaptic, translateX]);

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <View
      style={[
        styles.container,
        { height, backgroundColor: colors.backgroundColor },
      ]}
    >
      {/* Header */}
      {renderHeader ? (
        renderHeader(displayDate, isTodaySelected, handleResetToToday)
      ) : (
        <View style={styles.headerContainer}>
          <View style={styles.dateHeader}>
            <Text
              style={[styles.yearText, { color: colors.labelColor }]}
            >
              {showYear ? displayYear : ''}
            </Text>
            <Text
              style={[
                styles.dateText,
                { color: colors.accentColor },
              ]}
            >
              {displayFormat}
            </Text>
          </View>

          {showResetToToday && !isTodaySelected && (
            <TouchableOpacity
              onPress={handleResetToToday}
              style={styles.resetBtn}
            >
              <Text
                style={[
                  styles.resetText,
                  { color: colors.accentColor },
                ]}
              >
                Today
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Ruler */}
      <GestureDetector gesture={pan}>
        <View style={[styles.rulerContainer, { height: rulerHeight }]}>
          <View
            style={[
              styles.centerIndicator,
              {
                backgroundColor: colors.indicatorColor,
                width: indicatorWidth,
                height: indicatorHeight,
              },
            ]}
          />

          <Animated.View style={[styles.ticksWrapper, animatedStyle]}>
            {visibleTicks.map((tick: TickData) => (
              <Tick
                key={tick.offset}
                offset={tick.offset}
                isLabeled={tick.isLabeled}
                isToday={tick.isToday}
                isHighlighted={tick.isHighlighted}
                dateStr={tick.dateStr}
                tickSpacing={tickSpacing}
                tickHeight={tickHeight}
                tickTallHeight={tickTallHeight}
                tickThickness={tickThickness}
                tickColor={colors.tickColor}
                tickTallColor={colors.tickTallColor}
                labelColor={colors.labelColor}
                accentColor={colors.accentColor}
                todayDotSize={todayDotSize}
                labelFontSize={labelFontSize}
                rulerHeight={rulerHeight}
              />
            ))}
          </Animated.View>
        </View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 20,
    height: 40,
  },
  dateHeader: {
    alignItems: 'center',
  },
  yearText: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 2,
  },
  dateText: {
    fontSize: 18,
    fontWeight: '600',
  },
  resetBtn: {
    position: 'absolute',
    right: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  resetText: {
    fontSize: 14,
    fontWeight: '600',
  },
  rulerContainer: {
    width: SCREEN_WIDTH,
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  centerIndicator: {
    position: 'absolute',
    zIndex: 10,
    bottom: 0,
  },
  ticksWrapper: {
    position: 'absolute',
    height: '100%',
    width: 0,
    left: SCREEN_WIDTH / 2,
  },
});

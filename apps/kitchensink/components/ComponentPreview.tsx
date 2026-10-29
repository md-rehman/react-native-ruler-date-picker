import React, { useState, useEffect, useMemo } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import {
  RulerDatePicker,
  RulerDateRangePicker,
  RulerRoot,
  RulerTrack,
  RulerIndicator,
  RulerTicks,
  RulerHeader,
  RulerResetButton,
  RulerRangeRoot,
  RulerRangeTrack,
  useRulerDatePicker,
  useRulerDateRangePicker,
  formatDateString,
  DateRange,
} from 'react-native-ruler-date-picker';
import { ComponentType } from '../data/examples';
import { useTheme } from '../context/ThemeContext';
import { SPACING } from '../theme/tokens';

interface ComponentPreviewProps {
  pickerProps: Record<string, any>;
  componentType?: ComponentType;
  updateProp: (name: string, value: any) => void;
}

// ── Headless Hook Demo Components ───────────────────────────────────────────

function HeadlessSingleDemo({
  props,
  updateProp,
  labelColor,
  accentColor,
}: {
  props: Record<string, any>;
  updateProp: (name: string, value: any) => void;
  labelColor: string;
  accentColor: string;
}) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const {
    selectedDate: hookDate,
    selectedDateStr,
    resetToToday,
    scrollToDate,
  } = useRulerDatePicker({
    value: selectedDate,
    onChange: (d, s) => {
      setSelectedDate(d);
      updateProp('value', s);
    },
    tickSpacing: props.tickSpacing ?? 24,
    theme: props.theme,
  });

  return (
    <View style={styles.headlessContainer}>
      <View style={styles.badgeContainer}>
        <Text style={[styles.hookBadge, { borderColor: accentColor, color: accentColor }]}>
          Headless Hook
        </Text>
      </View>

      <Text style={[styles.hookTitle, { color: labelColor }]}>
        {selectedDateStr || formatDateString(hookDate || selectedDate)}
      </Text>

      <Text style={[styles.hookSubtitle, { color: labelColor, opacity: 0.7 }]}>
        State, deceleration physics, and graduation windowing bound to custom UI.
      </Text>

      <View style={styles.headlessActions}>
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: accentColor }]}
          onPress={() => resetToToday(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.actionBtnText}>Reset to Today</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionBtnSecondary, { borderColor: accentColor }]}
          onPress={() => {
            const nextWeek = new Date(selectedDate.getTime() + 7 * 86400000);
            setSelectedDate(nextWeek);
            scrollToDate(nextWeek, true);
          }}
          activeOpacity={0.8}
        >
          <Text style={[styles.actionBtnSecondaryText, { color: accentColor }]}>+7 Days</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.pickerWrapper}>
        <RulerDatePicker
          {...props}
          value={selectedDate}
          header={false}
          onChange={(date, str) => {
            setSelectedDate(date);
            updateProp('value', str);
          }}
        />
      </View>
    </View>
  );
}

function HeadlessRangeDemo({
  props,
  updateProp,
  labelColor,
  accentColor,
}: {
  props: Record<string, any>;
  updateProp: (name: string, value: any) => void;
  labelColor: string;
  accentColor: string;
}) {
  const [range, setRange] = useState<DateRange>({
    start: new Date(),
    end: new Date(Date.now() + 5 * 86400000),
  });

  const {
    activeHandle,
    startDate,
    endDate,
    spanDays,
    scrollToHandle,
  } = useRulerDateRangePicker({
    value: range,
    minSpanDays: props.minSpanDays ?? 2,
    maxSpanDays: props.maxSpanDays ?? 20,
    tickSpacing: props.tickSpacing ?? 24,
    theme: props.theme,
    onChange: (p) => {
      setRange({ start: p.startDate, end: p.endDate });
      updateProp('value.start', p.startString);
      updateProp('value.end', p.endString);
    },
  });

  return (
    <View style={styles.headlessContainer}>
      <View style={styles.badgeContainer}>
        <Text style={[styles.hookBadge, { borderColor: accentColor, color: accentColor }]}>
          Headless Range Hook
        </Text>
      </View>

      <Text style={[styles.hookTitle, { color: labelColor }]}>
        {formatDateString(startDate || range.start)} → {formatDateString(endDate || range.end)}
      </Text>

      <View style={styles.infoRow}>
        <Text style={[styles.infoPill, { backgroundColor: 'rgba(128,128,128,0.12)', color: labelColor }]}>
          Span: <Text style={{ color: accentColor, fontWeight: '700' }}>{spanDays ?? 5} days</Text>
        </Text>
        <Text style={[styles.infoPill, { backgroundColor: 'rgba(128,128,128,0.12)', color: labelColor }]}>
          Focus: <Text style={{ color: accentColor, fontWeight: '700' }}>{activeHandle?.toUpperCase() || 'START'}</Text>
        </Text>
      </View>

      <View style={styles.headlessActions}>
        <TouchableOpacity
          style={[styles.actionBtnSecondary, { borderColor: accentColor }]}
          onPress={() => scrollToHandle('start', true)}
          activeOpacity={0.8}
        >
          <Text style={[styles.actionBtnSecondaryText, { color: accentColor }]}>Scroll to Start</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionBtnSecondary, { borderColor: accentColor }]}
          onPress={() => scrollToHandle('end', true)}
          activeOpacity={0.8}
        >
          <Text style={[styles.actionBtnSecondaryText, { color: accentColor }]}>Scroll to End</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.pickerWrapper}>
        <RulerDateRangePicker
          {...props}
          value={range}
          header={false}
          onChange={(payload) => {
            setRange({ start: payload.startDate, end: payload.endDate });
            updateProp('value.start', payload.startString);
            updateProp('value.end', payload.endString);
          }}
        />
      </View>
    </View>
  );
}

// ── Main Component Preview ──────────────────────────────────────────────────

export const ComponentPreview: React.FC<ComponentPreviewProps> = ({
  pickerProps,
  componentType = 'RulerDatePicker',
  updateProp,
}) => {
  const { theme, colors } = useTheme();
  const isDark = theme === 'dark';

  // Single date state
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [dateStr, setDateStr] = useState<string>('');

  // Range state
  const [range, setRange] = useState<{ start: Date; end: Date }>(() => ({
    start: new Date(),
    end: new Date(Date.now() + 7 * 86400000),
  }));

  // Sync value prop
  useEffect(() => {
    if (pickerProps.value && typeof pickerProps.value === 'string') {
      const parsed = new Date(pickerProps.value);
      if (!isNaN(parsed.getTime())) {
        setSelectedDate(parsed);
        setDateStr(pickerProps.value);
      }
    } else if (pickerProps.value && typeof pickerProps.value === 'object' && pickerProps.value.start) {
      const s = new Date(pickerProps.value.start);
      const e = new Date(pickerProps.value.end);
      if (!isNaN(s.getTime()) && !isNaN(e.getTime())) {
        setRange({ start: s, end: e });
      }
    }
  }, [pickerProps.value]);

  // Compute effective theme dynamically matching the active kitchensink theme (light / dark)
  const effectiveTheme = useMemo(() => {
    const userTheme = pickerProps.theme || {};

    const defaultLabelColor = isDark ? '#F5F5F7' : '#1D1D1F';
    const defaultTickColor = isDark ? '#4B5563' : '#CBD5E1';

    // Adapt label color if it wasn't customized to a specific accent color
    const isStandardLabel =
      !userTheme.labelColor ||
      userTheme.labelColor === '#FAFAFA' ||
      userTheme.labelColor === '#F8FAFC' ||
      userTheme.labelColor === '#F4F4F5' ||
      userTheme.labelColor === '#ECFDF5' ||
      userTheme.labelColor === '#F3F4F6' ||
      userTheme.labelColor === '#F1F5F9' ||
      userTheme.labelColor === '#F5F5F7' ||
      userTheme.labelColor === '#1D1D1F' ||
      userTheme.labelColor === '#0F172A';

    const isStandardTick =
      !userTheme.defaultTickColor ||
      userTheme.defaultTickColor === '#3F3F46' ||
      userTheme.defaultTickColor === '#334155' ||
      userTheme.defaultTickColor === '#27272A' ||
      userTheme.defaultTickColor === '#374151' ||
      userTheme.defaultTickColor === '#CBD5E1' ||
      userTheme.defaultTickColor === '#D1D5DB' ||
      userTheme.defaultTickColor === '#4B5563';

    const labelColor = isStandardLabel ? defaultLabelColor : userTheme.labelColor;
    const defaultTick = isStandardTick ? defaultTickColor : userTheme.defaultTickColor;
    const accentColor = userTheme.accentColor || colors.accent;
    const indicatorColor = userTheme.indicatorColor || accentColor;

    let rangeHighlightColor = userTheme.rangeHighlightColor;
    if (rangeHighlightColor) {
      rangeHighlightColor = isDark
        ? rangeHighlightColor
        : rangeHighlightColor.replace('0.22', '0.15').replace('0.25', '0.15');
    }

    return {
      ...userTheme,
      background: 'transparent',
      labelColor,
      defaultTickColor: defaultTick,
      accentColor,
      indicatorColor,
      ...(rangeHighlightColor ? { rangeHighlightColor } : {}),
    };
  }, [theme, colors, isDark, pickerProps.theme]);

  const effectiveProps: Record<string, any> = useMemo(() => ({
    ...pickerProps,
    theme: effectiveTheme,
  }), [pickerProps, effectiveTheme]);

  const labelColor = effectiveTheme.labelColor;
  const accentColor = effectiveTheme.accentColor;

  const renderContent = () => {
    // 1. Headless Hook Demos
    if (componentType === 'useRulerDatePicker') {
      return (
        <HeadlessSingleDemo
          props={effectiveProps}
          updateProp={updateProp}
          labelColor={labelColor}
          accentColor={accentColor}
        />
      );
    }
    if (componentType === 'useRulerDateRangePicker') {
      return (
        <HeadlessRangeDemo
          props={effectiveProps}
          updateProp={updateProp}
          labelColor={labelColor}
          accentColor={accentColor}
        />
      );
    }

    // 2. RulerCompound (Single)
    if (componentType === 'RulerCompound') {
      return (
        <View style={styles.centerContent}>
          <View style={styles.header}>
            <Text style={[styles.dateText, { color: labelColor }]}>
              {dateStr || formatDateString(selectedDate)}
            </Text>
            <Text style={[styles.subBadge, { color: accentColor }]}>Compound Ruler.Root</Text>
          </View>

          <View style={styles.pickerWrapper}>
            <RulerRoot
              value={selectedDate}
              onChange={(date, str) => {
                setSelectedDate(date);
                setDateStr(str);
                updateProp('value', str);
              }}
              {...effectiveProps}
            >
              <RulerHeader showResetToToday={effectiveProps.header?.showResetToToday ?? false} />
              <RulerTrack>
                <RulerIndicator />
                <RulerTicks />
              </RulerTrack>
              <View style={styles.resetWrapper}>
                <RulerResetButton />
              </View>
            </RulerRoot>
          </View>
        </View>
      );
    }

    // 3. RulerRangeCompound (Range)
    if (componentType === 'RulerRangeCompound') {
      return (
        <View style={styles.centerContent}>
          <View style={styles.header}>
            <Text style={[styles.rangeText, { color: labelColor }]}>
              {formatDateString(range.start)} → {formatDateString(range.end)}
            </Text>
            <Text style={[styles.subBadge, { color: accentColor }]}>Compound RulerRange.Root</Text>
          </View>

          <View style={styles.pickerWrapper}>
            <RulerRangeRoot
              value={range}
              onChange={({ startDate, endDate, startString, endString }) => {
                setRange({ start: startDate, end: endDate });
                updateProp('value.start', startString);
                updateProp('value.end', endString);
              }}
              {...effectiveProps}
            >
              <RulerRangeTrack />
            </RulerRangeRoot>
          </View>
        </View>
      );
    }

    // 4. RulerDateRangePicker
    if (componentType === 'RulerDateRangePicker') {
      const spanDays = Math.max(1, Math.round((range.end.getTime() - range.start.getTime()) / 86400000));
      return (
        <View style={styles.centerContent}>
          <View style={styles.header}>
            <Text style={[styles.rangeText, { color: labelColor }]}>
              {formatDateString(range.start)} → {formatDateString(range.end)}
            </Text>
            <Text style={[styles.subBadge, { color: accentColor }]}>
              {spanDays} {spanDays === 1 ? 'day' : 'days'} duration
            </Text>
          </View>

          <View style={styles.pickerWrapper}>
            <RulerDateRangePicker
              {...effectiveProps}
              value={range}
              onChange={({ startDate, endDate, startString, endString }) => {
                setRange({ start: startDate, end: endDate });
                updateProp('value.start', startString);
                updateProp('value.end', endString);
              }}
            />
          </View>
        </View>
      );
    }

    // 5. Default: RulerDatePicker
    return (
      <View style={styles.centerContent}>
        <View style={styles.header}>
          <Text style={[styles.dateText, { color: labelColor }]}>
            {dateStr || formatDateString(selectedDate)}
          </Text>
        </View>

        <View style={styles.pickerWrapper}>
          <RulerDatePicker
            key={theme}
            {...effectiveProps}
            value={selectedDate}
            onChange={(d, s) => {
              setSelectedDate(d);
              if (s) {
                setDateStr(s);
                updateProp('value', s);
              }
            }}
          />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.outerContainer} pointerEvents="box-none">
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: SPACING.md,
  },
  centerContent: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    marginBottom: SPACING.md,
    alignItems: 'center',
  },
  dateText: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  rangeText: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  subBadge: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  pickerWrapper: {
    width: '100%',
    alignItems: 'center',
  },
  resetWrapper: {
    alignItems: 'center',
    marginTop: 12,
  },

  // Headless Demo Styles
  headlessContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
  },
  badgeContainer: {
    marginBottom: 8,
  },
  hookBadge: {
    fontSize: 10,
    fontWeight: '700',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  hookTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 4,
    textAlign: 'center',
  },
  hookSubtitle: {
    fontSize: 11,
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 16,
    paddingHorizontal: 8,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  infoPill: {
    fontSize: 11,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 16,
  },
  headlessActions: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  actionBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  actionBtnText: {
    color: '#0F172A',
    fontWeight: '700',
    fontSize: 11,
  },
  actionBtnSecondary: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
  },
  actionBtnSecondaryText: {
    fontWeight: '700',
    fontSize: 11,
  },
});

"use client";

import React, { useState, useEffect } from 'react';
import {
  View as RNViewComponent,
  Text as RNTextComponent,
  TouchableOpacity as RNTouchableComponent,
  StyleSheet,
  type ViewProps,
  type TextProps,
  type TouchableOpacityProps,
} from 'react-native';
const View = RNViewComponent as unknown as React.ComponentType<ViewProps>;
const Text = RNTextComponent as unknown as React.ComponentType<TextProps>;
const TouchableOpacity = RNTouchableComponent as unknown as React.ComponentType<TouchableOpacityProps>;

import { GestureHandlerRootView } from 'react-native-gesture-handler';
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
  RulerRangeIndicator,
  RulerRangeHeader,
  RulerRangeHighlight,
  useRulerDatePicker,
  useRulerDateRangePicker,
  formatDateString,
  DateRange,
} from 'react-native-ruler-date-picker';
import { ComponentType } from '../../../data/examples';
import styles from './ComponentPreview.module.css';

interface ComponentPreviewProps {
  props: Record<string, any>;
  componentType?: ComponentType;
  updateProp: (name: string, value: any) => void;
}

// ── Headless Hook Demo Components ───────────────────────────────────────────

function HeadlessSingleDemo({
  props,
  updateProp,
}: {
  props: Record<string, any>;
  updateProp: (name: string, value: any) => void;
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
  });

  const accentColor = props.theme?.accentColor || '#38BDF8';
  const labelColor = props.theme?.labelColor || '#F8FAFC';

  return (
    <View style={rnStyles.headlessContainer}>
      <View style={rnStyles.badgeContainer}>
        <Text style={[rnStyles.hookBadge, { borderColor: accentColor, color: accentColor }]}>
          Headless Hook
        </Text>
      </View>

      <Text style={[rnStyles.hookTitle, { color: labelColor }]}>
        {selectedDateStr || formatDateString(hookDate || selectedDate)}
      </Text>

      <Text style={rnStyles.hookSubtitle}>
        State, deceleration physics, and graduation windowing bound to custom UI.
      </Text>

      <View style={rnStyles.headlessActions}>
        <TouchableOpacity
          style={[rnStyles.actionBtn, { backgroundColor: accentColor }]}
          onPress={() => resetToToday(true)}
        >
          <Text style={rnStyles.actionBtnText}>Reset to Today</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[rnStyles.actionBtnSecondary, { borderColor: accentColor }]}
          onPress={() => {
            const nextWeek = new Date(selectedDate.getTime() + 7 * 86400000);
            setSelectedDate(nextWeek);
            scrollToDate(nextWeek, true);
          }}
        >
          <Text style={[rnStyles.actionBtnSecondaryText, { color: accentColor }]}>+7 Days</Text>
        </TouchableOpacity>
      </View>

      <View style={rnStyles.pickerContainer}>
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
}: {
  props: Record<string, any>;
  updateProp: (name: string, value: any) => void;
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
    onChange: (p) => {
      setRange({ start: p.startDate, end: p.endDate });
      updateProp('value.start', p.startString);
      updateProp('value.end', p.endString);
    },
  });

  const accentColor = props.theme?.accentColor || '#10B981';
  const labelColor = props.theme?.labelColor || '#F1F5F9';

  return (
    <View style={rnStyles.headlessContainer}>
      <View style={rnStyles.badgeContainer}>
        <Text style={[rnStyles.hookBadge, { borderColor: accentColor, color: accentColor }]}>
          Headless Range Hook
        </Text>
      </View>

      <Text style={[rnStyles.hookTitle, { color: labelColor }]}>
        {formatDateString(startDate || range.start)} → {formatDateString(endDate || range.end)}
      </Text>

      <View style={rnStyles.infoRow}>
        <Text style={[rnStyles.infoPill, { backgroundColor: 'rgba(255,255,255,0.06)', color: labelColor }]}>
          Span: <Text style={{ color: accentColor, fontWeight: '700' }}>{spanDays ?? 5} days</Text>
        </Text>
        <Text style={[rnStyles.infoPill, { backgroundColor: 'rgba(255,255,255,0.06)', color: labelColor }]}>
          Focus: <Text style={{ color: accentColor, fontWeight: '700' }}>{activeHandle?.toUpperCase() || 'START'}</Text>
        </Text>
      </View>

      <View style={rnStyles.headlessActions}>
        <TouchableOpacity
          style={[rnStyles.actionBtnSecondary, { borderColor: accentColor }]}
          onPress={() => scrollToHandle('start', true)}
        >
          <Text style={[rnStyles.actionBtnSecondaryText, { color: accentColor }]}>Scroll to Start</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[rnStyles.actionBtnSecondary, { borderColor: accentColor }]}
          onPress={() => scrollToHandle('end', true)}
        >
          <Text style={[rnStyles.actionBtnSecondaryText, { color: accentColor }]}>Scroll to End</Text>
        </TouchableOpacity>
      </View>

      <View style={rnStyles.pickerContainer}>
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

export default function ComponentPreview({
  props,
  componentType = 'RulerDatePicker',
  updateProp,
}: ComponentPreviewProps) {
  // Single date state
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [dateStr, setDateStr] = useState<string>('');

  // Range state
  const [range, setRange] = useState<{ start: Date; end: Date }>(() => ({
    start: new Date(),
    end: new Date(Date.now() + 7 * 86400000),
  }));

  // Sync single value
  useEffect(() => {
    if (props.value && typeof props.value === 'string') {
      const parsed = new Date(props.value);
      if (!isNaN(parsed.getTime())) {
        setSelectedDate(parsed);
        setDateStr(props.value);
      }
    } else if (props.value && typeof props.value === 'object' && props.value.start) {
      const s = new Date(props.value.start);
      const e = new Date(props.value.end);
      if (!isNaN(s.getTime()) && !isNaN(e.getTime())) {
        setRange({ start: s, end: e });
      }
    }
  }, [props.value]);

  const bgColor = props.theme?.background || 'transparent';
  const labelColor = props.theme?.labelColor || '#94A3B8';
  const accentColor = props.theme?.accentColor || '#38BDF8';

  const renderContent = () => {
    // 1. Headless Hook Demos
    if (componentType === 'useRulerDatePicker') {
      return <HeadlessSingleDemo props={props} updateProp={updateProp} />;
    }
    if (componentType === 'useRulerDateRangePicker') {
      return <HeadlessRangeDemo props={props} updateProp={updateProp} />;
    }

    // 2. RulerCompound (Single)
    if (componentType === 'RulerCompound') {
      return (
        <View style={rnStyles.centerContent}>
          <View style={rnStyles.header}>
            <Text style={[rnStyles.title, { color: labelColor }]}>
              {dateStr || formatDateString(selectedDate)}
            </Text>
            <Text style={[rnStyles.subBadge, { color: accentColor }]}>Compound Ruler.Root</Text>
          </View>

          <View style={rnStyles.pickerContainer}>
            <RulerRoot
              value={selectedDate}
              onChange={(date, str) => {
                setSelectedDate(date);
                setDateStr(str);
                updateProp('value', str);
              }}
              {...props}
            >
              <RulerHeader showResetToToday={props.header?.showResetToToday ?? false} />
              <RulerTrack>
                <RulerIndicator />
                <RulerTicks />
              </RulerTrack>
              <View style={rnStyles.resetWrapper}>
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
        <View style={rnStyles.centerContent}>
          <View style={rnStyles.header}>
            <Text style={[rnStyles.rangeTitle, { color: labelColor }]}>
              {formatDateString(range.start)} → {formatDateString(range.end)}
            </Text>
            <Text style={[rnStyles.subBadge, { color: accentColor }]}>Compound RulerRange.Root</Text>
          </View>

          <View style={rnStyles.pickerContainer}>
            <RulerRangeRoot
              value={range}
              onChange={({ startDate, endDate, startString, endString }) => {
                setRange({ start: startDate, end: endDate });
                updateProp('value.start', startString);
                updateProp('value.end', endString);
              }}
              {...props}
            >
              <RulerRangeHeader />
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
        <View style={rnStyles.centerContent}>
          <View style={rnStyles.header}>
            <Text style={[rnStyles.rangeTitle, { color: labelColor }]}>
              {formatDateString(range.start)} → {formatDateString(range.end)}
            </Text>
            <Text style={[rnStyles.subBadge, { color: accentColor }]}>
              {spanDays} {spanDays === 1 ? 'day' : 'days'} duration
            </Text>
          </View>

          <View style={rnStyles.pickerContainer}>
            <RulerDateRangePicker
              {...props}
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
      <View style={rnStyles.centerContent}>
        <View style={rnStyles.header}>
          <Text style={[rnStyles.title, { color: labelColor }]}>
            {dateStr || formatDateString(selectedDate)}
          </Text>
        </View>

        <View style={rnStyles.pickerContainer}>
          <RulerDatePicker
            {...props}
            value={selectedDate}
            onChange={(date, str) => {
              setSelectedDate(date);
              setDateStr(str);
              updateProp('value', str);
            }}
          />
        </View>
      </View>
    );
  };

  return (
    <div className={styles.wrapper}>
      <GestureHandlerRootView style={rnStyles.root}>
        <View style={[rnStyles.container, { backgroundColor: bgColor }]}>
          {renderContent()}
        </View>
      </GestureHandlerRootView>
    </div>
  );
}

const rnStyles = StyleSheet.create({
  root: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 12,
  },
  centerContent: {
    width: '100%',
    alignItems: 'center',
  },
  header: {
    marginBottom: 36,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  rangeTitle: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  subBadge: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  pickerContainer: {
    width: '100%',
    paddingVertical: 12,
  },
  resetWrapper: {
    alignItems: 'center',
    marginTop: 14,
  },

  // Headless Demo Styles
  headlessContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  badgeContainer: {
    marginBottom: 12,
  },
  hookBadge: {
    fontSize: 11,
    fontWeight: '700',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  hookTitle: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 6,
    textAlign: 'center',
  },
  hookSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 18,
    paddingHorizontal: 12,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  infoPill: {
    fontSize: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  headlessActions: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  actionBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  actionBtnText: {
    color: '#0F172A',
    fontWeight: '700',
    fontSize: 12,
  },
  actionBtnSecondary: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  actionBtnSecondaryText: {
    fontWeight: '700',
    fontSize: 12,
  },
});

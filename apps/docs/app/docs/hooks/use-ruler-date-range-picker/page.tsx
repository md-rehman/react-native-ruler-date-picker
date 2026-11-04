import React from 'react';
import type { Metadata } from 'next';
import {
  DocHeader,
  Callout,
  CodeBlock,
  PropsTable,
  DocPagination,
} from '../../../components/DocElements/DocElements';

import InlinePlayground from '../../../components/InlinePlayground/InlinePlayground';

export const metadata: Metadata = {
  title: 'useRulerDateRangePicker Hook | react-native-ruler-date-picker',
  description: 'Headless hook managing dual-handle date range physics, active handle switching, and span constraints.',
};

export default function UseRulerDateRangePickerPage() {
  const currentHref = '/docs/hooks/use-ruler-date-range-picker';

  const headlessRangeJsx = `import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { useRulerDateRangePicker, Tick } from 'react-native-ruler-date-picker';

export function CustomRangeView() {
  const [range, setRange] = useState({
    start: new Date(),
    end: new Date(Date.now() + 6 * 86400000),
  });

  const {
    panGesture,
    translateX,
    startDateStr,
    endDateStr,
    spanDays,
    activeHandle,
    scrollToHandle,
    visibleTicks,
    tickSpacing,
    rulerHeight,
    startOffset,
    endOffset,
  } = useRulerDateRangePicker({
    value: range,
    minSpanDays: 2,
    maxSpanDays: 21,
    onChange: ({ startDate, endDate }) => setRange({ start: startDate, end: endDate }),
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const highlightLeft = startOffset * tickSpacing - tickSpacing / 2;
  const highlightWidth = Math.max(tickSpacing, (endOffset - startOffset + 1) * tickSpacing);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => scrollToHandle('start', true)} style={styles.pill}>
          <Text style={styles.pillText}>START: {startDateStr}</Text>
        </TouchableOpacity>
        <Text style={styles.spanText}>➔ {spanDays} days</Text>
        <TouchableOpacity onPress={() => scrollToHandle('end', true)} style={styles.pill}>
          <Text style={styles.pillText}>END: {endDateStr}</Text>
        </TouchableOpacity>
      </View>

      <GestureDetector gesture={panGesture}>
        <View style={[styles.viewport, { height: rulerHeight }]}>
          <View style={styles.activePin} />
          <Animated.View style={styles.track, animatedStyle}>
            <View style={[styles.highlight, { left: highlightLeft, width: highlightWidth }]} />
            {visibleTicks.map((tick) => (
              <Tick key={tick.offset} tick={tick} tickSpacing={tickSpacing} rulerHeight={rulerHeight} />
            ))}
          </Animated.View>
        </View>
      </GestureDetector>
    </View>
  );
}`;

  return (
    <div>
      <DocHeader
        category="Hooks"
        badge="#headless"
        isExperimental={true}
        title="useRulerDateRangePicker"
        description="The headless engine powering RulerDateRangePicker. Coordinates dual-handle Reanimated coordinates, collision prevention, and interval clamping."
      />

      <Callout type="warning" title="Experimental Headless Hook">
        <code>useRulerDateRangePicker</code> and its return contract (<code>UseRulerDateRangePickerReturn</code>) are <strong>Experimental</strong>. Internal worklets, shared value names, and handle coordination mechanics may receive breaking adjustments in future minor updates.
      </Callout>

      <section style={{ marginBottom: 40 }}>
        <h2>1. Dual-Handle Coordinate System</h2>
        <p>
          Managing two interactive draggable handles on an infinite or bounded ruler requires continuous collision detection and handle focus toggling. <code>useRulerDateRangePicker</code> handles this under the hood using native worklets:
        </p>

        <InlinePlayground
          title="Headless Range Hook Preview"
          type="headless-range"
          jsxCode={headlessRangeJsx}
          props={{
            minSpanDays: 2,
            maxSpanDays: 21,
            tickSpacing: 28,
            rulerHeight: 64,
          }}
        />
      </section>

      <section style={{ marginBottom: 40 }}>
        <h2>2. Hook Parameters</h2>

        <PropsTable
          data={[
            {
              name: 'value / initialRange',
              type: 'DateRange',
              description: 'Controlled or initial date range object { start, end }.',
            },
            {
              name: 'onChange',
              type: '(payload: DateRangeChangePayload) => void',
              description: 'Callback fired when either handle settles on a new day offset.',
            },
            {
              name: 'minSpanDays',
              type: 'number',
              default: '1',
              description: 'Minimum required days separating start and end offsets.',
            },
            {
              name: 'maxSpanDays',
              type: 'number',
              default: '-',
              description: 'Maximum allowable days separating start and end offsets.',
            },
            {
              name: 'minDate / maxDate',
              type: 'Date | string',
              description: 'Track boundary bounds.',
            },
            {
              name: 'tickSpacing',
              type: 'number',
              default: '24',
              description: 'Pixel distance between tick marks.',
            },
          ]}
        />
      </section>

      <section style={{ marginBottom: 40 }}>
        <h2>3. Return Signature</h2>

        <PropsTable
          data={[
            {
              name: 'startOffset',
              type: 'SharedValue<number>',
              description: 'Pixel coordinate of the start handle.',
            },
            {
              name: 'endOffset',
              type: 'SharedValue<number>',
              description: 'Pixel coordinate of the end handle.',
            },
            {
              name: 'activeHandle',
              type: "SharedValue<'start' | 'end'>",
              description: 'Currently focused handle receiving touch input.',
            },
            {
              name: 'setActiveHandle',
              type: "(handle: 'start' | 'end') => void",
              description: 'Imperatively set focus to either handle.',
            },
            {
              name: 'setRange',
              type: '(range: DateRange) => void',
              description: 'Programmatically reposition both handles to a specific date interval.',
            },
            {
              name: 'days',
              type: 'number',
              description: 'Current duration in days between start and end.',
            },
          ]}
        />
      </section>

      <DocPagination currentHref={currentHref} />
    </div>
  );
}

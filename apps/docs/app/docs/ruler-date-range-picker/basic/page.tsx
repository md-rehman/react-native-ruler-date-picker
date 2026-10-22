import React from 'react';
import type { Metadata } from 'next';
import {
  DocHeader,
  Callout,
  CodeBlock,
  DocPagination,
} from '../../../components/DocElements/DocElements';
import InlinePlayground from '../../../components/InlinePlayground/InlinePlayground';

export const metadata: Metadata = {
  title: 'RulerDateRangePicker - Basic Usage | react-native-ruler-date-picker',
  description: 'Dual-handle date range selection with connecting highlight strips and span constraints.',
};

export default function RulerDateRangePickerBasicPage() {
  const currentHref = '/docs/ruler-date-range-picker/basic';

  const rangeJsx = `<RulerDateRangePicker
  value={{
    start: new Date(),
    end: new Date(Date.now() + 7 * 86400000),
  }}
  onChange={({ startDate, endDate }) => {
    console.log('Selected Span:', startDate, 'to', endDate);
  }}
  minSpanDays={2}
  maxSpanDays={14}
  tickSpacing={26}
  rulerHeight={64}
/>`;

  return (
    <div>
      <DocHeader
        category="RulerDateRangePicker"
        badge="#range"
        title="Basic Usage"
        description="Select continuous date intervals with interactive dual handles, automatic handle switching, and dynamic connecting highlight strips."
      />

      <section style={{ marginBottom: 40 }}>
        <h2>1. Interactive Date Range Demo</h2>
        <p>
          Drag either handle to adjust start or end dates. Tap anywhere along the ruler to smoothly switch focus to the nearest handle:
        </p>

        <InlinePlayground
          title="Dual Handle Range Picker"
          type="range"
          jsxCode={rangeJsx}
          props={{
            minSpanDays: 2,
            maxSpanDays: 14,
            tickSpacing: 26,
            rulerHeight: 64,
          }}
        />
      </section>

      <section style={{ marginBottom: 40 }}>
        <h2>2. Controlled State Binding</h2>
        <p>
          Bind an object with <code>start</code> and <code>end</code> dates to <code>value</code>:
        </p>

        <CodeBlock
          title="RangePickerScreen.tsx"
          language="tsx"
          code={`import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { RulerDateRangePicker, DateRange } from 'react-native-ruler-date-picker';

export default function BookingScreen() {
  const [range, setRange] = useState<DateRange>({
    start: new Date(),
    end: new Date(Date.now() + 5 * 86400000), // +5 days
  });

  return (
    <View style={styles.container}>
      <RulerDateRangePicker
        value={range}
        onChange={({ startDate, endDate, dateRange }) => {
          setRange(dateRange);
          console.log('Start:', startDate);
          console.log('End:', endDate);
        }}
        minSpanDays={1}
        maxSpanDays={30}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#0F172A',
  },
});`}
        />
      </section>

      <section style={{ marginBottom: 40 }}>
        <h2>3. Span Constraints (minSpanDays & maxSpanDays)</h2>
        <p>
          Enforce business logic limits on the minimum and maximum allowable duration in days:
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, margin: '20px 0' }}>
          <div style={{ padding: 20, borderRadius: 'var(--radius-lg)', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}>
            <h4 style={{ margin: '0 0 8px 0', color: 'var(--color-accent)' }}>minSpanDays</h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.5 }}>
              Prevents the start and end handles from getting closer than the specified number of days (e.g. <code>minSpanDays={'{2}'}</code> requires at least a 2-night stay).
            </p>
          </div>

          <div style={{ padding: 20, borderRadius: 'var(--radius-lg)', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}>
            <h4 style={{ margin: '0 0 8px 0', color: '#10b981' }}>maxSpanDays</h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.5 }}>
              Caps the maximum allowable span (e.g. <code>maxSpanDays={'{14}'}</code> limits bookings or analytics filters to at most two weeks).
            </p>
          </div>
        </div>
      </section>

      <section style={{ marginBottom: 40 }}>
        <h2>4. Active Handle Auto-Switching</h2>
        <p>
          The range picker features smart handle detection:
        </p>
        <ul>
          <li><strong>Proximity Tapping:</strong> Tapping anywhere on the track automatically activates the closer handle and animates it toward the tapped graduation.</li>
          <li><strong>Drag Prevention:</strong> Handles will never cross or invert; dragging the start handle towards the end handle smoothly pushes or stops according to <code>minSpanDays</code>.</li>
        </ul>

        <Callout type="tip" title="Dual-Handle Haptics">
          Both handles emit individual tactile ticks as they cross graduations, giving users physical feedback for both interval boundaries.
        </Callout>
      </section>

      <DocPagination currentHref={currentHref} />
    </div>
  );
}

import React from 'react';
import type { Metadata } from 'next';
import {
  DocHeader,
  Callout,
  CodeBlock,
  PropsTable,
  DocPagination,
} from '../../../components/DocElements/DocElements';

export const metadata: Metadata = {
  title: 'useRulerDateRangePicker Hook | react-native-ruler-date-picker',
  description: 'Headless hook managing dual-handle date range physics, active handle switching, and span constraints.',
};

export default function UseRulerDateRangePickerPage() {
  const currentHref = '/docs/hooks/use-ruler-date-range-picker';

  return (
    <div>
      <DocHeader
        category="Hooks"
        badge="#headless"
        title="useRulerDateRangePicker"
        description="The headless engine powering RulerDateRangePicker. Coordinates dual-handle Reanimated coordinates, collision prevention, and interval clamping."
      />

      <section style={{ marginBottom: 40 }}>
        <h2>1. Dual-Handle Coordinate System</h2>
        <p>
          Managing two interactive draggable handles on an infinite or bounded ruler requires continuous collision detection and handle focus toggling. <code>useRulerDateRangePicker</code> handles this under the hood using native worklets:
        </p>

        <CodeBlock
          title="HeadlessRange.tsx"
          language="tsx"
          code={`import React from 'react';
import { View } from 'react-native';
import { useRulerDateRangePicker } from 'react-native-ruler-date-picker';

export function CustomRangeView() {
  const {
    startOffset,
    endOffset,
    activeHandle,
    setActiveHandle,
    setRange,
    startDate,
    endDate,
    days,
  } = useRulerDateRangePicker({
    initialRange: { start: new Date(), end: new Date(Date.now() + 7 * 86400000) },
    minSpanDays: 2,
    maxSpanDays: 21,
    onChange: ({ startDate, endDate }) => {
      console.log('Selected Interval:', startDate, endDate);
    },
  });

  return (
    <View>
      {/* Build custom dual-slider or calendar visualization */}
    </View>
  );
}`}
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
              default: 'undefined',
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

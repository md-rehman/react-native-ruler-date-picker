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
  title: 'Utility Hooks & Helpers | react-native-ruler-date-picker',
  description: 'useHaptics, useResolvedTheme, and DST-safe calendar math utilities.',
};

export default function UtilityHooksPage() {
  const currentHref = '/docs/hooks/utility-hooks';

  const utilitiesData = [
    {
      name: 'formatDateString(date?: Date)',
      type: 'string',
      description: 'Formats a Date object to "YYYY-MM-DD" local string, avoiding UTC timezone day-shift bugs caused by toISOString().',
    },
    {
      name: 'normalizeDate(input?: Date | string)',
      type: 'Date',
      description: 'Parses Date or YYYY-MM-DD string to local midnight (00:00:00.000) Date object with invalid date fallback.',
    },
    {
      name: 'dateToDayOffset(date, referenceTime)',
      type: 'number',
      description: 'Converts a Date or string to an integer day offset relative to an epoch reference timestamp.',
    },
    {
      name: 'dayOffsetToDate(offset, referenceTime)',
      type: 'Date',
      description: 'Converts a day offset back to a Date object using native calendar arithmetic (setDate) to avoid 23h/25h Daylight Saving Time drift.',
    },
    {
      name: 'computeDayRange(todayTime, minDate?, maxDate?)',
      type: '{ minOffset, maxOffset }',
      description: 'Calculates lower and upper integer day boundaries from optional props.',
    },
  ];

  return (
    <div>
      <DocHeader
        category="Hooks"
        badge="#utils"
        title="Utility Hooks & Helpers"
        description="Helper hooks and timezone-safe date math functions exported for standalone application use."
      />

      <section style={{ marginBottom: 40 }}>
        <h2>1. useHaptics Hook</h2>
        <p>
          You can utilize the package's dual-speed haptic feedback hook in your own gesture or scroll interfaces:
        </p>

        <CodeBlock
          title="CustomTactileList.tsx"
          language="tsx"
          code={`import { useHaptics } from 'react-native-ruler-date-picker';

export function MyCustomWheel() {
  const { triggerStepHaptic, triggerFastHaptic } = useHaptics({
    enabled: true,
    speedThreshold: 800,
    throttleMs: 40,
  });

  const onIndexChange = (velocity: number) => {
    if (Math.abs(velocity) > 800) {
      triggerFastHaptic();
    } else {
      triggerStepHaptic();
    }
  };
}`}
        />
      </section>

      <section style={{ marginBottom: 40 }}>
        <h2>2. Date & Timezone Utilities</h2>
        <p>
          Timezone bugs and Daylight Saving Time (DST) 23-hour/25-hour day shifts are common pitfalls when building custom date components. The following pure helper functions are exported:
        </p>

        <PropsTable data={utilitiesData} />

        <CodeBlock
          title="DateUtils.ts"
          language="typescript"
          code={`import {
  formatDateString,
  normalizeDate,
  dayOffsetToDate,
  dateToDayOffset,
  MS_PER_DAY,
} from 'react-native-ruler-date-picker';

const today = normalizeDate();
const dateStr = formatDateString(today); // e.g. "2026-10-22"
const offset = dateToDayOffset('2026-10-25', today.getTime()); // +3 days`}
        />
      </section>

      <DocPagination currentHref={currentHref} />
    </div>
  );
}

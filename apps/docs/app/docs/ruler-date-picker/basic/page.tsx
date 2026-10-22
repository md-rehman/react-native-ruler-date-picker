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
  title: 'RulerDatePicker - Basic Usage | react-native-ruler-date-picker',
  description: 'Learn how to use and configure RulerDatePicker for single date selection.',
};

export default function RulerDatePickerBasicPage() {
  const currentHref = '/docs/ruler-date-picker/basic';

  const basicUsageJsx = `<RulerDatePicker
  value={selectedDate}
  onChange={(date, dateStr) => {
    setSelectedDate(date);
    console.log('Selected:', dateStr);
  }}
  minDate="2026-01-01"
  maxDate="2026-12-31"
  tickSpacing={26}
  rulerHeight={64}
  header={{ showResetToToday: true }}
/>`;

  return (
    <div>
      <DocHeader
        category="RulerDatePicker"
        badge="#component"
        title="Basic Usage"
        description="RulerDatePicker provides a turnkey, high-performance horizontal ruler picker designed for frictionless date selection."
      />

      <section style={{ marginBottom: 40 }}>
        <h2>1. Interactive Demo</h2>
        <p>
          Try scrolling between dates. Notice the automatic header synchronization and the "Today" reset jump action:
        </p>

        <InlinePlayground
          title="Turnkey RulerDatePicker"
          type="single"
          jsxCode={basicUsageJsx}
          props={{
            tickSpacing: 26,
            rulerHeight: 64,
            header: { showResetToToday: true },
          }}
        />
      </section>

      <section style={{ marginBottom: 40 }}>
        <h2>2. Controlled State Binding</h2>
        <p>
          Bind your component's state using <code>value</code> and handle changes via <code>onChange</code>:
        </p>

        <CodeBlock
          title="SingleDatePicker.tsx"
          language="tsx"
          code={`import React, { useState } from 'react';
import { RulerDatePicker } from 'react-native-ruler-date-picker';

export default function MyScreen() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  return (
    <RulerDatePicker
      value={selectedDate}
      onChange={(date, dateString) => {
        setSelectedDate(date);
        // date: Date object at local midnight
        // dateString: "YYYY-MM-DD" local date string
      }}
    />
  );
}`}
        />

        <Callout type="tip" title="Timezone-Safe Date String">
          The second argument to <code>onChange</code> is a local <code>YYYY-MM-DD</code> string formatted without UTC shifting bugs caused by native <code>toISOString()</code>.
        </Callout>
      </section>

      <section style={{ marginBottom: 40 }}>
        <h2>3. Date Boundaries (minDate & maxDate)</h2>
        <p>
          Constrain selectable dates by supplying <code>minDate</code> and <code>maxDate</code> as either <code>Date</code> instances or <code>YYYY-MM-DD</code> strings:
        </p>

        <CodeBlock
          title="BoundedPicker.tsx"
          language="tsx"
          code={`<RulerDatePicker
  value={selectedDate}
  onChange={setSelectedDate}
  minDate="2026-06-01"
  maxDate="2026-08-31"
/>`}
        />
        <p>
          When the user scrolls past boundary limits, inertial physics smoothly dampens and snaps back to the allowable edge.
        </p>
      </section>

      <section style={{ marginBottom: 40 }}>
        <h2>4. Sizing & Indicator Customization</h2>
        <p>
          Adjust horizontal spacing between graduation marks with <code>tickSpacing</code>, overall viewport height with <code>rulerHeight</code>, and needle dimensions via <code>indicator</code>:
        </p>

        <CodeBlock
          title="CustomIndicator.tsx"
          language="tsx"
          code={`<RulerDatePicker
  value={selectedDate}
  onChange={setSelectedDate}
  tickSpacing={32}
  rulerHeight={72}
  indicator={{
    width: 3,
    height: 48,
    borderRadius: 2,
    color: '#0A84FF',
  }}
/>`}
        />
      </section>

      <DocPagination currentHref={currentHref} />
    </div>
  );
}

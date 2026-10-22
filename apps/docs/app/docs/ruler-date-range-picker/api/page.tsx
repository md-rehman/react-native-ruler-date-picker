import React from 'react';
import type { Metadata } from 'next';
import {
  DocHeader,
  PropsTable,
  CodeBlock,
  DocPagination,
} from '../../../components/DocElements/DocElements';

export const metadata: Metadata = {
  title: 'RulerDateRangePicker - API Reference | react-native-ruler-date-picker',
  description: 'Complete props table, types, defaults, and callback signatures for RulerDateRangePicker.',
};

export default function RulerDateRangePickerApiPage() {
  const currentHref = '/docs/ruler-date-range-picker/api';

  const rangeProps = [
    {
      name: 'value',
      type: 'DateRange',
      description: 'Controlled date range object: { start: Date | string, end: Date | string }.',
    },
    {
      name: 'onChange',
      type: '(payload: DateRangeChangePayload) => void',
      description: 'Callback fired on handle movement with { startDate, endDate, dateRange, days }.',
    },
    {
      name: 'minSpanDays',
      type: 'number',
      default: '1',
      description: 'Minimum required distance in days between start and end handles.',
    },
    {
      name: 'maxSpanDays',
      type: 'number',
      default: 'undefined',
      description: 'Maximum allowable distance in days between start and end handles.',
    },
    {
      name: 'minDate',
      type: 'Date | string',
      default: 'undefined',
      description: 'Earliest selectable date boundary across the entire ruler track.',
    },
    {
      name: 'maxDate',
      type: 'Date | string',
      default: 'undefined',
      description: 'Latest selectable date boundary across the entire ruler track.',
    },
    {
      name: 'tickSpacing',
      type: 'number',
      default: '24',
      description: 'Horizontal distance in pixels between consecutive graduation marks.',
    },
    {
      name: 'rulerHeight',
      type: 'number',
      default: '60',
      description: 'Height in pixels of the interactive ruler viewport track.',
    },
    {
      name: 'header',
      type: 'boolean | RangeHeaderConfig',
      default: 'true',
      description: 'Enable or configure the range header with custom labels and formatters.',
    },
    {
      name: 'highlight',
      type: 'boolean | RangeHighlightConfig',
      default: 'true',
      description: 'Enable or configure the highlighted connecting interval strip.',
    },
    {
      name: 'indicator',
      type: 'boolean | RangeIndicatorConfig',
      default: 'true',
      description: 'Appearance configuration for start and end handle pins.',
    },
    {
      name: 'theme',
      type: 'RulerTheme',
      default: 'auto',
      description: 'Custom theme tokens overriding default Light/Dark color scheme.',
    },
  ];

  return (
    <div>
      <DocHeader
        category="RulerDateRangePicker"
        badge="#api"
        title="API Reference"
        description="Comprehensive props reference, type definitions, and callback signatures for <RulerDateRangePicker />."
      />

      <section style={{ marginBottom: 40 }}>
        <h2>Props Reference Table</h2>
        <PropsTable data={rangeProps} />
      </section>

      <section style={{ marginBottom: 40 }}>
        <h2>TypeScript Interfaces</h2>

        <CodeBlock
          title="rangeTypes.ts"
          language="typescript"
          code={`export interface DateRange {
  start: Date | string;
  end: Date | string;
}

export interface DateRangeChangePayload {
  startDate: Date;
  endDate: Date;
  dateRange: DateRange;
  days: number;
}

export interface RulerDateRangePickerProps {
  value?: DateRange;
  onChange?: (payload: DateRangeChangePayload) => void;
  minDate?: Date | string;
  maxDate?: Date | string;
  minSpanDays?: number;
  maxSpanDays?: number;
  tickSpacing?: number;
  rulerHeight?: number;
  header?: boolean | RangeHeaderConfig;
  highlight?: boolean | RangeHighlightConfig;
  indicator?: boolean | RangeIndicatorConfig;
  theme?: RulerTheme;
}`}
        />
      </section>

      <DocPagination currentHref={currentHref} />
    </div>
  );
}

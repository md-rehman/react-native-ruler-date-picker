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
      default: 'Today → Today + 7d',
      description: 'Controlled date range object: { start: Date | string, end: Date | string }.',
    },
    {
      name: 'defaultValue',
      type: 'DateRange',
      default: 'Today → Today + 7d',
      description: 'Initial selected date range for uncontrolled usage.',
    },
    {
      name: 'onChange',
      type: '(payload: DateRangeChangePayload) => void',
      default: '-',
      description: 'Callback fired on handle drag/snap with { startDate, endDate, dateRange, spanDays }.',
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
      default: '-',
      description: 'Maximum allowable distance in days between start and end handles (defaults to unlimited).',
    },
    {
      name: 'minDate',
      type: 'Date | string',
      default: 'Today - 365 days',
      description: 'Earliest selectable date boundary across the entire ruler track.',
    },
    {
      name: 'maxDate',
      type: 'Date | string',
      default: 'Today + 365 days',
      description: 'Latest selectable date boundary across the entire ruler track.',
    },
    {
      name: 'locale',
      type: 'string',
      default: "'default'",
      description: 'BCP 47 language tag (e.g. "en-US", "de-DE") for localized month and weekday labels.',
    },
    {
      name: 'ticks',
      type: "'calendar' | 'metric' | 'minimal' | TickRule[]",
      default: "'calendar'",
      description: 'Graduation tick mark preset or custom array of declarative tick rules.',
    },
    {
      name: 'tickSpacing',
      type: 'number',
      default: '24',
      description: 'Horizontal distance in pixels between consecutive graduation marks.',
    },
    {
      name: 'tickWidth',
      type: 'number',
      default: '3',
      description: 'Base thickness in pixels for tick graduation bars.',
    },
    {
      name: 'width',
      type: 'number',
      default: 'Window width',
      description: 'Viewport track width in pixels. Defaults to device window dimensions width.',
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
      description: 'Enable or configure the dual-date range header with custom labels and formatters.',
    },
    {
      name: 'highlight',
      type: 'boolean | RangeHighlightConfig',
      default: 'true',
      description: 'Enable or configure the highlighted connecting interval strip between handles.',
    },
    {
      name: 'indicator',
      type: 'boolean | RangeIndicatorConfig',
      default: 'true',
      description: 'Appearance configuration for start and end handle pins.',
    },
    {
      name: 'haptics',
      type: 'boolean | HapticConfig',
      default: 'true',
      description: 'Enable dual-speed tactile vibration feedback when scrolling across handle boundaries.',
    },
    {
      name: 'theme',
      type: 'RulerTheme',
      default: 'auto (system)',
      description: 'Custom theme tokens overriding default Light/Dark color scheme.',
    },
    {
      name: 'debounceMs',
      type: 'number',
      default: '100',
      description: 'Debounce duration in milliseconds for onChange events during rapid continuous scrolling.',
    },
    {
      name: 'style',
      type: 'StyleProp<ViewStyle>',
      default: '-',
      description: 'Custom styles applied to the outer root container view.',
    },
    {
      name: 'testID',
      type: 'string',
      default: '-',
      description: 'Identifier for automated testing and element inspection.',
    },
    {
      name: 'accessibilityLabel',
      type: 'string',
      default: "'Date range picker'",
      description: 'Screen reader accessibility label for assistive technologies.',
    },
  ];

  const rangeIndicatorProps = [
    {
      name: 'width',
      type: 'number',
      default: '2',
      description: 'Width of the handle needle pointers in pixels.',
    },
    {
      name: 'height',
      type: 'number',
      default: '40',
      description: 'Height of the handle needle pointers in pixels.',
    },
    {
      name: 'color',
      type: 'string',
      default: 'theme.indicatorColor',
      description: 'Color of the start and end handle needle bars.',
    },
    {
      name: 'alignment',
      type: "'bottom' | 'center' | 'top'",
      default: "'bottom'",
      description: 'Vertical alignment of the handle needles inside the track.',
    },
    {
      name: 'style',
      type: 'StyleProp<ViewStyle>',
      default: '-',
      description: 'Style overrides applied directly to the handle views.',
    },
    {
      name: 'render',
      type: "(handle: 'start' | 'end', date: Date) => React.ReactNode",
      default: '-',
      description: 'Custom renderer for start/end handles receiving the handle identifier and its current date.',
    },
  ];

  const rangeHeaderProps = [
    {
      name: 'format',
      type: '(date: Date) => string',
      default: '-',
      description: 'Custom date format function for the start and end date labels.',
    },
    {
      name: 'dateStyle',
      type: 'StyleProp<TextStyle>',
      default: '-',
      description: 'Style overrides for the start and end date label text.',
    },
    {
      name: 'style',
      type: 'StyleProp<ViewStyle>',
      default: '-',
      description: 'Style overrides for the range header container view.',
    },
    {
      name: 'render',
      type: '(context: RangeHeaderContext) => React.ReactNode',
      default: '-',
      description: 'Custom range header renderer receiving { start, end, spanDays, activeHandle, scrollToHandle }.',
    },
  ];

  const rangeHighlightProps = [
    {
      name: 'color',
      type: 'string',
      default: 'theme.rangeHighlightColor',
      description: 'Color of the range connecting highlight strip (defaults to theme token).',
    },
    {
      name: 'style',
      type: 'StyleProp<ViewStyle>',
      default: '-',
      description: 'Custom style applied to the range highlight connecting bar.',
    },
    {
      name: 'render',
      type: '(startOffset: number, endOffset: number, tickSpacing: number) => React.ReactNode',
      default: '-',
      description: 'Custom renderer for the connecting interval strip.',
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
        <h2>Subcomponent Configurations</h2>

        <h3 style={{ marginTop: 24, marginBottom: 12 }}>RangeIndicatorConfig</h3>
        <p>Passed to the <code>indicator</code> prop to customize the start and end handle needles:</p>
        <PropsTable data={rangeIndicatorProps} />

        <h3 style={{ marginTop: 32, marginBottom: 12 }}>RangeHeaderConfig</h3>
        <p>Passed to the <code>header</code> prop to customize the range display header:</p>
        <PropsTable data={rangeHeaderProps} />

        <h3 style={{ marginTop: 32, marginBottom: 12 }}>RangeHighlightConfig</h3>
        <p>Passed to the <code>highlight</code> prop to customize the connecting interval strip:</p>
        <PropsTable data={rangeHighlightProps} />
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
  start: Date;
  end: Date;
  startDate: Date;
  endDate: Date;
  startString: string;
  endString: string;
  spanDays: number;
}

export interface RulerDateRangePickerProps {
  value?: DateRange;
  defaultValue?: DateRange;
  onChange?: (range: DateRangeChangePayload) => void;
  minDate?: Date | string;
  maxDate?: Date | string;
  minSpanDays?: number;
  maxSpanDays?: number;
  locale?: string;
  ticks?: 'calendar' | 'metric' | 'minimal' | TickRule[];
  tickSpacing?: number;
  tickWidth?: number;
  width?: number;
  rulerHeight?: number;
  header?: boolean | RangeHeaderConfig;
  highlight?: boolean | RangeHighlightConfig;
  indicator?: boolean | RangeIndicatorConfig;
  haptics?: boolean | HapticConfig;
  theme?: RulerTheme;
  debounceMs?: number;
  style?: StyleProp<ViewStyle>;
  testID?: string;
  accessibilityLabel?: string;
}`}
        />
      </section>

      <DocPagination currentHref={currentHref} />
    </div>
  );
}

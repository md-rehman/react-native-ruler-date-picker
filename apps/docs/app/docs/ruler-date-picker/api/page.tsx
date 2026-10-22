import React from 'react';
import type { Metadata } from 'next';
import {
  DocHeader,
  PropsTable,
  CodeBlock,
  DocPagination,
} from '../../../components/DocElements/DocElements';
import { PROP_DEFINITIONS } from '../../../../data/propDefinitions';

export const metadata: Metadata = {
  title: 'RulerDatePicker - API Reference | react-native-ruler-date-picker',
  description: 'Complete props table, types, defaults, and callback signatures for RulerDatePicker.',
};

export default function RulerDatePickerApiPage() {
  const currentHref = '/docs/ruler-date-picker/api';

  const tableData = PROP_DEFINITIONS.map((p) => ({
    name: p.name,
    type: p.type,
    default: p.defaultValue !== undefined && p.defaultValue !== '' ? String(p.defaultValue) : '—',
    description: p.description || '—',
  }));

  return (
    <div>
      <DocHeader
        category="RulerDatePicker"
        badge="#api"
        title="API Reference"
        description="Comprehensive props reference, type definitions, and callback parameters for <RulerDatePicker />."
      />

      <section style={{ marginBottom: 40 }}>
        <h2>Props Reference Table</h2>
        <PropsTable data={tableData} />
      </section>

      <section style={{ marginBottom: 40 }}>
        <h2>TypeScript Interfaces</h2>
        <p>
          Key TypeScript interfaces exported from the package for <code>RulerDatePicker</code>:
        </p>

        <CodeBlock
          title="types.ts"
          language="typescript"
          code={`export interface RulerDatePickerProps {
  // Value & Selection
  value?: Date | string;
  onChange?: (date: Date, dateString: string) => void;
  minDate?: Date | string;
  maxDate?: Date | string;
  initialDate?: Date | string;
  locale?: string;

  // Layout & Dimensions
  tickSpacing?: number;
  rulerHeight?: number;
  bufferTicks?: number;

  // Features
  ticks?: 'calendar' | 'metric' | 'minimal' | TickRule[];
  lensEffect?: boolean | LensConfig;
  haptics?: boolean | HapticConfig;

  // Subcomponent Configs
  indicator?: boolean | IndicatorConfig;
  header?: boolean | HeaderConfig;
  theme?: RulerTheme;
}`}
        />
      </section>

      <DocPagination currentHref={currentHref} />
    </div>
  );
}

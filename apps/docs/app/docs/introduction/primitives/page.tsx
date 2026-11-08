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
import type { TickRule } from 'react-native-ruler-date-picker';

export const metadata: Metadata = {
  title: 'Primitives (Ticks & LensTicks) | react-native-ruler-date-picker',
  description: 'Deep dive into graduation marks, virtualized windowing, and rule-based tick resolution.',
};

export default function PrimitivesPage() {
  const currentHref = '/docs/introduction/primitives';

  const customRuleJsx = `<RulerDatePicker
  value={selectedDate}
  onChange={(date) => setSelectedDate(date)}
  tickSpacing={28}
  ticks={[
    // 1st of month: Tall cyan line + Month abbreviation label
    {
      condition: 'monthly',
      height: 36,
      width: 3.5,
      color: '#38BDF8',
      label: {
        format: (date) => date.toLocaleDateString('en-US', { month: 'short' }),
        color: '#38BDF8',
        fontWeight: '700',
      },
    },
    // Weekend dot badge (Sundays & Saturdays)
    {
      condition: { dayOfWeek: [0, 6] },
      height: 24,
      width: 2.5,
      color: '#F59E0B',
      dot: { size: 4, color: '#F59E0B' },
    },
    // Every 5 days: Medium graduation mark with day number
    {
      condition: { interval: 5 },
      height: 20,
      width: 2,
      color: '#64748B',
      label: {
        format: (date) => String(date.getDate()),
        color: '#94A3B8',
      },
    },
    // Catch-all daily fallback
    {
      condition: 'daily',
      height: 12,
      width: 2,
      color: '#334155',
    },
  ]}
/>`;

  return (
    <div>
      <DocHeader
        category="Introduction"
        badge="#core"
        title="Primitives (Ticks & LensTicks)"
        description="The graduation engine in react-native-ruler-date-picker is powered by virtualized windowing and a declarative, rule-based tick evaluation system."
      />

      <section style={{ marginBottom: 40 }}>
        <h2>1. The Graduation Architecture</h2>
        <p>
          Unlike naive implementations that render hundreds or thousands of DOM or native nodes, <code>react-native-ruler-date-picker</code> uses a <strong>windowed virtualization pipeline</strong>.
        </p>
        <p>
          At any moment, only the ticks physically inside the viewport plus a configurable buffer (e.g. 5 ticks on each side) are calculated and mounted. As the user pans or coasts with Reanimated decay physics, tick coordinates are recycled, ensuring steady 60 FPS performance regardless of date range scale.
        </p>
      </section>

      <section style={{ marginBottom: 40 }}>
        <h2>2. Interactive Rule Customization</h2>
        <p>
          Every tick graduation is styled by evaluating an array of declarative <code>TickRule</code> objects against a <code>TickContext</code>. The rules are matched from top to bottom (first matching rule wins).
        </p>

        <InlinePlayground
          title="Rule-Based Tick Resolution"
          type="single"
          jsxCode={customRuleJsx}
          props={{
            tickSpacing: 28,
            ticks: 'metric',
          }}
        />
      </section>

      <section style={{ marginBottom: 40 }}>
        <h2>3. Built-In Presets</h2>
        <p>
          Three production-tested presets are bundled out of the box and can be specified as a string shorthand on the <code>ticks</code> prop:
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, margin: '20px 0' }}>
          <div style={{ padding: 18, borderRadius: 'var(--radius-lg)', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}>
            <h4 style={{ margin: '0 0 8px 0', color: 'var(--color-accent)' }}>"calendar" (Default)</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', margin: 0 }}>
              Special marks for the 1st of every month, subtle highlights on Sundays, and standard graduations for intermediate days.
            </p>
          </div>

          <div style={{ padding: 18, borderRadius: 'var(--radius-lg)', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}>
            <h4 style={{ margin: '0 0 8px 0', color: '#10b981' }}>"metric"</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', margin: 0 }}>
              Classic engineering ruler with 3-tier graduations: major marks every 10 units, medium marks every 5 units, and minor marks every 1 unit.
            </p>
          </div>

          <div style={{ padding: 18, borderRadius: 'var(--radius-lg)', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}>
            <h4 style={{ margin: '0 0 8px 0', color: '#f59e0b' }}>"minimal"</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', margin: 0 }}>
              Clean, uniform graduations with zero extraneous labels or dots, ideal for compact widgets and high-density screens.
            </p>
          </div>
        </div>
      </section>

      <section style={{ marginBottom: 40 }}>
        <h2>4. The TickRule Specification</h2>
        <p>
          A custom rule object accepts the following configuration properties:
        </p>

        <PropsTable
          data={[
            {
              name: 'condition',
              type: 'TickCondition',
              default: "'daily'",
              description: "Matching predicate: 'daily' | 'weekly' | 'monthly' | 'yearly' | { interval: number } | { dayOfWeek: number[] } | ((ctx: TickContext) => boolean). Omit for fallback match.",
            },
            {
              name: 'height',
              type: 'number',
              default: '12',
              description: 'Height in pixels of the vertical graduation mark.',
            },
            {
              name: 'width',
              type: 'number',
              default: '3',
              description: 'Width/thickness in pixels of the graduation line.',
            },
            {
              name: 'color',
              type: 'string',
              default: 'theme.defaultTickColor',
              description: 'Color of the graduation tick line.',
            },
            {
              name: 'label',
              type: 'boolean | TickLabelConfig',
              default: 'undefined',
              description: 'Date label configuration or true for day number. Config: { format?: (date, ctx) => string, color?: string, fontSize?: number, fontWeight?: string }.',
            },
            {
              name: 'dot',
              type: 'boolean | TickDotConfig',
              default: 'undefined',
              description: 'Circular badge indicator. Config: { size?: number, color?: string } or true for default 6px dot.',
            },
            {
              name: 'render',
              type: '(ctx: TickContext) => React.ReactNode',
              default: 'undefined',
              description: 'Custom React Native renderer replacing the default tick bar, label, and dot for complete rendering freedom.',
            },
          ]}
        />
      </section>

      <section style={{ marginBottom: 40 }}>
        <h2>5. Custom Predicate & Custom Render</h2>
        <p>
          For advanced requirements, you can pass a custom function to <code>condition</code> to evaluate arbitrary calendar math, or provide a <code>render</code> function to replace the native graduation with custom icons or badges:
        </p>

        <CodeBlock
          title="CustomTickExample.tsx"
          language="tsx"
          code={`import React from 'react';
import { View, Text } from 'react-native';
import type { TickRule } from 'react-native-ruler-date-picker';

export const customRules: TickRule[] = [
  // 1. Custom Predicate: Highlight paydays (15th & month-end)
  {
    condition: (ctx) => {
      const day = ctx.date.getDate();
      const lastDay = new Date(ctx.date.getFullYear(), ctx.date.getMonth() + 1, 0).getDate();
      return day === 15 || day === lastDay;
    },
    height: 32,
    color: '#10B981',
    dot: { size: 5, color: '#10B981' },
    label: {
      format: () => 'Payday',
      color: '#10B981',
      fontWeight: '700',
    },
  },

  // 2. Custom Render: Render weekday initials with custom layout
  {
    condition: 'weekly',
    height: 24,
    render: (ctx) => (
      <View style={{ alignItems: 'center' }}>
        <Text style={{ color: ctx.isSelected ? '#38BDF8' : '#64748B', fontSize: 11, fontWeight: '600' }}>
          {ctx.date.toLocaleDateString('en-US', { weekday: 'narrow' })}
        </Text>
        <View style={{ width: 2, height: 16, backgroundColor: ctx.isSelected ? '#38BDF8' : '#475569', marginTop: 4 }} />
      </View>
    ),
  },

  // 3. Daily base fallback
  { condition: 'daily', height: 12 },
];`}
        />
      </section>

      <section style={{ marginBottom: 40 }}>
        <h2>6. The LensTick Primitive</h2>
        <p>
          When <code>lensEffect</code> is enabled, standard <code>Tick</code> components are replaced with <code>LensTick</code>.
        </p>
        <p>
          Each <code>LensTick</code> calculates its non-linear distance from the center focal point and interpolates:
        </p>
        <ul>
          <li><strong>Height & Width:</strong> Magnified according to the Gaussian/power-law lens falloff curve.</li>
          <li><strong>Non-Linear Horizontal Spacing:</strong> Ticks spread out under the lens focus and compress near the edges.</li>
          <li><strong>Opacity:</strong> Naturally softens toward the viewport extremities.</li>
        </ul>

        <Callout type="tip" title="Compound Support">
          If you are building a custom compound layout, you can use <code>&lt;RulerLensTrack /&gt;</code> and <code>&lt;RulerLensTicks /&gt;</code> directly instead of standard <code>&lt;RulerTrack /&gt;</code>.
        </Callout>
      </section>

      <DocPagination currentHref={currentHref} />
    </div>
  );
}

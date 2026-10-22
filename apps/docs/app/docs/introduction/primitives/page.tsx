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
  title: 'Primitives (Ticks & LensTicks) | react-native-ruler-date-picker',
  description: 'Deep dive into graduation marks, virtualized windowing, and rule-based tick resolution.',
};

export default function PrimitivesPage() {
  const currentHref = '/docs/introduction/primitives';

  const customRuleJsx = `<RulerDatePicker
  value={selectedDate}
  onChange={setSelectedDate}
  tickSpacing={28}
  ticks={[
    // Major 1st-of-month milestone: Tall line + Month abbreviation label
    {
      condition: { dayOfMonth: 1 },
      height: 36,
      width: 3,
      color: '#38BDF8',
      label: {
        text: (ctx) => ctx.date.toLocaleDateString('en-US', { month: 'short' }),
        position: 'bottom',
        color: '#38BDF8',
      },
    },
    // Weekend dot indicator
    {
      condition: { dayOfWeek: 0 },
      height: 22,
      width: 2,
      dot: { size: 4, color: '#F59E0B', position: 'top' },
    },
    // Every 5 days
    {
      condition: { interval: 5 },
      height: 20,
      width: 2,
      color: '#64748B',
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
          Every tick graduation is styled by evaluating an array of declarative <code>TickRule</code> objects against a <code>TickContext</code>.
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
              description: 'Criteria determining whether this rule applies: interval, dayOfMonth, dayOfWeek, or month.',
            },
            {
              name: 'height',
              type: 'number',
              default: '20',
              description: 'Height in pixels of the vertical graduation line.',
            },
            {
              name: 'width',
              type: 'number',
              default: '2',
              description: 'Width in pixels of the graduation line.',
            },
            {
              name: 'color',
              type: 'string',
              default: 'theme.defaultTickColor',
              description: 'Color of the graduation tick line.',
            },
            {
              name: 'dot',
              type: 'TickDotConfig',
              description: 'Optional circular dot marker: { size, color, position: "top" | "bottom" }.',
            },
            {
              name: 'label',
              type: 'TickLabelConfig',
              description: 'Optional text label: { text: string | ((ctx) => string), color, position: "top" | "bottom" }.',
            },
          ]}
        />
      </section>

      <section style={{ marginBottom: 40 }}>
        <h2>5. The LensTick Primitive</h2>
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

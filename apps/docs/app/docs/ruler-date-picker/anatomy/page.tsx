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
  title: 'RulerDatePicker - Compound Anatomy | react-native-ruler-date-picker',
  description: 'Modular subcomponents breakdown: Ruler.Root, Ruler.Track, Ruler.Indicator, Ruler.Ticks, and Ruler.Header.',
};

export default function RulerDatePickerAnatomyPage() {
  const currentHref = '/docs/ruler-date-picker/anatomy';

  const compoundJsx = `<Ruler.Root
  value={selectedDate}
  onChange={setSelectedDate}
  tickSpacing={28}
>
  {/* 1. Header with custom placement */}
  <Ruler.Header showResetToToday={false} />

  {/* 2. Scroll arena containing needle & graduation ticks */}
  <Ruler.Track>
    <Ruler.Indicator />
    <Ruler.Ticks />
  </Ruler.Track>

  {/* 3. Standalone Reset button placed below track */}
  <View style={{ alignItems: 'center', marginTop: 12 }}>
    <Ruler.ResetButton label="Jump to Today" />
  </View>
</Ruler.Root>`;

  return (
    <div>
      <DocHeader
        category="RulerDatePicker"
        badge="#compound"
        title="Compound Anatomy"
        description="Build custom ruler layouts with complete inversion of control using granular compound subcomponents."
      />

      <section style={{ marginBottom: 40 }}>
        <h2>1. Interactive Compound Composition</h2>
        <p>
          In this example, the <code>&lt;Ruler.ResetButton&gt;</code> is decoupled from the header and mounted independently underneath the track:
        </p>

        <InlinePlayground
          title="Modular Compound Layout"
          type="compound"
          jsxCode={compoundJsx}
          props={{
            tickSpacing: 28,
          }}
        />
      </section>

      <section style={{ marginBottom: 40 }}>
        <h2>2. Compound Subcomponents Breakdown</h2>
        <p>
          You can import compound components via the <code>Ruler</code> namespace or individually as standalone named exports:
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, margin: '24px 0' }}>
          {/* RulerRoot */}
          <div style={{ padding: 22, borderRadius: 'var(--radius-lg)', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <h3 style={{ margin: 0, color: 'var(--color-accent)', fontFamily: 'ui-monospace, monospace' }}>&lt;Ruler.Root&gt; / &lt;RulerRoot&gt;</h3>
              <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: 4, background: 'rgba(10, 132, 255, 0.1)', color: 'var(--color-accent)', fontWeight: 700 }}>Provider</span>
            </div>
            <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: '0.9rem', lineHeight: 1.55 }}>
              The brain of the date picker. Houses Reanimated 3 shared values (<code>scrollX</code>, <code>activeIndex</code>), attaches the pan gesture handler, synchronizes controlled date state, and provides the <code>RulerContext</code> to all compound children.
            </p>
          </div>

          {/* RulerTrack */}
          <div style={{ padding: 22, borderRadius: 'var(--radius-lg)', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <h3 style={{ margin: 0, color: 'var(--color-accent)', fontFamily: 'ui-monospace, monospace' }}>&lt;Ruler.Track&gt; / &lt;RulerTrack&gt;</h3>
              <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: 4, background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', fontWeight: 700 }}>Viewport</span>
            </div>
            <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: '0.9rem', lineHeight: 1.55 }}>
              Defines the horizontal viewport bounds and clipping arena. Captures gesture touch interactions and translates them into smooth inertial scroll momentum.
            </p>
          </div>

          {/* RulerIndicator */}
          <div style={{ padding: 22, borderRadius: 'var(--radius-lg)', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <h3 style={{ margin: 0, color: 'var(--color-accent)', fontFamily: 'ui-monospace, monospace' }}>&lt;Ruler.Indicator&gt; / &lt;RulerIndicator&gt;</h3>
              <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: 4, background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', fontWeight: 700 }}>Center Pin</span>
            </div>
            <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: '0.9rem', lineHeight: 1.55 }}>
              The fixed center alignment cursor needle. Customizable via <code>width</code>, <code>height</code>, <code>color</code>, or by supplying a completely custom React component via children.
            </p>
          </div>

          {/* RulerTicks */}
          <div style={{ padding: 22, borderRadius: 'var(--radius-lg)', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <h3 style={{ margin: 0, color: 'var(--color-accent)', fontFamily: 'ui-monospace, monospace' }}>&lt;Ruler.Ticks&gt; / &lt;RulerTicks&gt;</h3>
              <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: 4, background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', fontWeight: 700 }}>Virtualization</span>
            </div>
            <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: '0.9rem', lineHeight: 1.55 }}>
              Calculates visible day offsets and mounts virtualized graduation ticks in the active viewport. Efficiently applies your <code>TickRule[]</code> array.
            </p>
          </div>

          {/* RulerHeader */}
          <div style={{ padding: 22, borderRadius: 'var(--radius-lg)', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <h3 style={{ margin: 0, color: 'var(--color-accent)', fontFamily: 'ui-monospace, monospace' }}>&lt;Ruler.Header&gt; / &lt;RulerHeader&gt;</h3>
              <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: 4, background: 'rgba(10, 132, 255, 0.1)', color: 'var(--color-accent)', fontWeight: 700 }}>Label</span>
            </div>
            <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: '0.9rem', lineHeight: 1.55 }}>
              Displays the currently focused date, month, or year formatted according to <code>formatDate</code> or device locale. Also hosts the optional inline jump-to-today button.
            </p>
          </div>

          {/* RulerResetButton */}
          <div style={{ padding: 22, borderRadius: 'var(--radius-lg)', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <h3 style={{ margin: 0, color: 'var(--color-accent)', fontFamily: 'ui-monospace, monospace' }}>&lt;Ruler.ResetButton&gt; / &lt;RulerResetButton&gt;</h3>
              <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: 4, background: 'rgba(236, 72, 153, 0.1)', color: '#ec4899', fontWeight: 700 }}>Action</span>
            </div>
            <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: '0.9rem', lineHeight: 1.55 }}>
              A context-aware button that smoothly animates the ruler back to today or the initial date. Can be placed anywhere inside <code>&lt;Ruler.Root&gt;</code>.
            </p>
          </div>
        </div>
      </section>

      <section style={{ marginBottom: 40 }}>
        <h2>3. Custom Indicator Example</h2>
        <p>
          Replace the standard needle with a custom diamond or beacon pin:
        </p>

        <CodeBlock
          title="CustomNeedle.tsx"
          language="tsx"
          code={`<Ruler.Root value={selectedDate} onChange={setSelectedDate}>
  <Ruler.Track>
    <Ruler.Indicator>
      <View style={{
        width: 14,
        height: 14,
        backgroundColor: '#38BDF8',
        transform: [{ rotate: '45deg' }],
        borderRadius: 3,
        shadowColor: '#38BDF8',
        shadowOpacity: 0.6,
        shadowRadius: 8,
      }} />
    </Ruler.Indicator>
    <Ruler.Ticks />
  </Ruler.Track>
</Ruler.Root>`}
        />
      </section>

      <DocPagination currentHref={currentHref} />
    </div>
  );
}

import React from 'react';
import type { Metadata } from 'next';
import {
  DocHeader,
  Callout,
  CodeBlock,
  DocPagination,
} from '../../../components/DocElements/DocElements';

export const metadata: Metadata = {
  title: 'RulerDateRangePicker - Compound Anatomy | react-native-ruler-date-picker',
  description: 'Compound subcomponents breakdown: RulerRange.Root, RulerRange.Track, RulerRange.Indicator, and RulerRange.Highlight.',
};

export default function RulerDateRangePickerAnatomyPage() {
  const currentHref = '/docs/ruler-date-range-picker/anatomy';

  return (
    <div>
      <DocHeader
        category="RulerDateRangePicker"
        badge="#compound"
        isExperimental={true}
        title="Compound Anatomy"
        description="Deconstruct and recombine range selection components: RulerRange.Root, Track, Highlight, Indicator, and Header."
      />

      <Callout type="warning" title="Experimental Compound Primitives">
        The <code>RulerRange</code> compound subcomponents (<code>RulerRange.Root</code>, <code>RulerRange.Track</code>, <code>RulerRange.Indicator</code>, <code>RulerRange.Highlight</code>) are <strong>Experimental</strong> and may receive breaking adjustments in future minor updates.
      </Callout>

      <section style={{ marginBottom: 40 }}>
        <h2>1. The RulerRange Anatomy</h2>
        <p>
          Similar to <code>Ruler</code>, <code>RulerRange</code> provides an inverted compound API enabling custom handle styles, headers, and highlight animations:
        </p>

        <CodeBlock
          title="CustomRangeComposition.tsx"
          language="tsx"
          code={`import React, { useState } from 'react';
import { RulerRange, DateRange } from 'react-native-ruler-date-picker';

export default function CustomRange() {
  const [range, setRange] = useState<DateRange>({
    start: new Date(),
    end: new Date(Date.now() + 7 * 86400000),
  });

  return (
    <RulerRange.Root value={range} onChange={({ dateRange }) => setRange(dateRange)}>
      {/* 1. Live range title & duration counter */}
      <RulerRange.Header />

      {/* 2. Interactive track with start/end handles and highlight strip */}
      <RulerRange.Track>
        <RulerRange.Highlight />
        <RulerRange.Indicator handle="start" />
        <RulerRange.Indicator handle="end" />
      </RulerRange.Track>
    </RulerRange.Root>
  );
}`}
        />
      </section>

      <section style={{ marginBottom: 40 }}>
        <h2>2. Compound Subcomponents Breakdown</h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, margin: '24px 0' }}>
          {/* RulerRangeRoot */}
          <div style={{ padding: 22, borderRadius: 'var(--radius-lg)', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <h3 style={{ margin: 0, color: 'var(--color-accent)', fontFamily: 'ui-monospace, monospace' }}>&lt;RulerRange.Root&gt;</h3>
              <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: 4, background: 'rgba(10, 132, 255, 0.1)', color: 'var(--color-accent)', fontWeight: 700 }}>Provider</span>
            </div>
            <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: '0.9rem', lineHeight: 1.55 }}>
              Manages the dual shared values (<code>startOffset</code>, <code>endOffset</code>), collision clamping, and active handle state. Provides <code>RulerRangeContext</code> to all child elements.
            </p>
          </div>

          {/* RulerRangeTrack */}
          <div style={{ padding: 22, borderRadius: 'var(--radius-lg)', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <h3 style={{ margin: 0, color: 'var(--color-accent)', fontFamily: 'ui-monospace, monospace' }}>&lt;RulerRange.Track&gt;</h3>
              <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: 4, background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', fontWeight: 700 }}>Viewport Arena</span>
            </div>
            <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: '0.9rem', lineHeight: 1.55 }}>
              Coordinates dual-handle gestures, handles hit testing for proximity selection, and clips graduation marks to the viewport.
            </p>
          </div>

          {/* RulerRangeIndicator */}
          <div style={{ padding: 22, borderRadius: 'var(--radius-lg)', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <h3 style={{ margin: 0, color: 'var(--color-accent)', fontFamily: 'ui-monospace, monospace' }}>&lt;RulerRange.Indicator&gt;</h3>
              <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: 4, background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', fontWeight: 700 }}>Dual Handles</span>
            </div>
            <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: '0.9rem', lineHeight: 1.55 }}>
              Renders either the <code>"start"</code> or <code>"end"</code> handle. Automatically elevates z-index when focused and responds to active dragging.
            </p>
          </div>

          {/* RulerRangeHighlight */}
          <div style={{ padding: 22, borderRadius: 'var(--radius-lg)', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <h3 style={{ margin: 0, color: 'var(--color-accent)', fontFamily: 'ui-monospace, monospace' }}>&lt;RulerRange.Highlight&gt;</h3>
              <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: 4, background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', fontWeight: 700 }}>Interval Band</span>
            </div>
            <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: '0.9rem', lineHeight: 1.55 }}>
              A tinted strip linking the start and end handles. Its width and translation dynamically interpolate in real time as handles move.
            </p>
          </div>

          {/* RulerRangeHeader */}
          <div style={{ padding: 22, borderRadius: 'var(--radius-lg)', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <h3 style={{ margin: 0, color: 'var(--color-accent)', fontFamily: 'ui-monospace, monospace' }}>&lt;RulerRange.Header&gt;</h3>
              <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: 4, background: 'rgba(10, 132, 255, 0.1)', color: 'var(--color-accent)', fontWeight: 700 }}>Live Readout</span>
            </div>
            <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: '0.9rem', lineHeight: 1.55 }}>
              Displays formatted start and end dates along with a duration badge (e.g. <code>"7 nights"</code> or <code>"14 days"</code>).
            </p>
          </div>
        </div>
      </section>

      <DocPagination currentHref={currentHref} />
    </div>
  );
}

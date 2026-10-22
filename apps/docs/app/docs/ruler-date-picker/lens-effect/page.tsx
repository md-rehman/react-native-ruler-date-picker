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
  title: 'RulerDatePicker - Lens Distortion Effect | react-native-ruler-date-picker',
  description: 'Fisheye optical magnification, non-linear tick spacing, and LensConfig options.',
};

export default function RulerDatePickerLensPage() {
  const currentHref = '/docs/ruler-date-picker/lens-effect';

  const lensJsx = `<RulerDatePicker
  value={selectedDate}
  onChange={setSelectedDate}
  lensEffect={{
    magnification: 1.6,
    focusRadius: 75,
    falloffExponent: 2.2,
  }}
  tickSpacing={24}
  rulerHeight={70}
/>`;

  return (
    <div>
      <DocHeader
        category="RulerDatePicker"
        badge="⚡ Fisheye"
        title="Lens Distortion Effect"
        description="Emulate a high-precision optical magnifying loupe with continuous non-linear fisheye distortion and dynamic tick expansion."
      />

      <section style={{ marginBottom: 40 }}>
        <h2>1. Interactive Optical Lens Demo</h2>
        <p>
          Scroll across the ruler. Notice how tick marks smoothly magnify, increase in height, and push outward as they approach the center focus line:
        </p>

        <InlinePlayground
          title="Fisheye Lens Magnification"
          type="lens"
          jsxCode={lensJsx}
          props={{
            tickSpacing: 24,
            rulerHeight: 70,
            header: { showResetToToday: true },
          }}
        />
      </section>

      <section style={{ marginBottom: 40 }}>
        <h2>2. How the Lens Effect Works</h2>
        <p>
          Standard linear rulers space ticks equally across the screen. When <code>lensEffect</code> is enabled, <code>react-native-ruler-date-picker</code> applies a non-linear magnification curve based on the tick's current distance from the center alignment needle:
        </p>
        <ul>
          <li><strong>Non-Linear Horizontal Spacing:</strong> Marks close to the center spread further apart, increasing readability of the active day and its immediate neighbors.</li>
          <li><strong>Vertical Magnification:</strong> Graduation lines smoothly scale up to <code>magnification</code> times their baseline height.</li>
          <li><strong>Optical Edge Compression:</strong> Peripheral marks gently compress toward the viewport boundary with a subtle opacity fade.</li>
        </ul>
      </section>

      <section style={{ marginBottom: 40 }}>
        <h2>3. LensConfig Options</h2>
        <p>
          You can enable the effect with a simple boolean <code>lensEffect={'{true}'}</code>, or pass a custom <code>LensConfig</code> object to fine-tune the optical physics:
        </p>

        <PropsTable
          data={[
            {
              name: 'magnification',
              type: 'number',
              default: '1.5',
              description: 'Maximum scale multiplier applied to the tick directly under the center needle.',
            },
            {
              name: 'focusRadius',
              type: 'number',
              default: '60',
              description: 'Distance in pixels from the center needle within which magnification occurs.',
            },
            {
              name: 'falloffExponent',
              type: 'number',
              default: '2.0',
              description: 'Steepness exponent of the distortion curve (higher values create a tighter, more concentrated lens).',
            },
            {
              name: 'minScale',
              type: 'number',
              default: '0.6',
              description: 'Minimum scale applied to distant peripheral graduation marks.',
            },
            {
              name: 'maxScale',
              type: 'number',
              default: '1.8',
              description: 'Absolute upper clamp on tick scale magnification.',
            },
          ]}
        />
      </section>

      <section style={{ marginBottom: 40 }}>
        <h2>4. Compound Usage: RulerLensTrack</h2>
        <p>
          If composing your ruler with compound subcomponents, use <code>&lt;RulerLensTrack /&gt;</code> instead of standard <code>&lt;RulerTrack /&gt;</code>:
        </p>

        <CodeBlock
          title="CompoundLens.tsx"
          language="tsx"
          code={`<Ruler.Root value={selectedDate} onChange={setSelectedDate} lensEffect>
  <Ruler.Header />
  {/* Dedicated lens track handles optical distortion */}
  <Ruler.LensTrack />
</Ruler.Root>`}
        />

        <Callout type="tip" title="High-Performance 60 FPS Math">
          Distortion offsets and transforms are calculated inside Reanimated worklets on the native UI thread, guaranteeing silky 60 FPS animation without JavaScript bridge bottlenecks.
        </Callout>
      </section>

      <DocPagination currentHref={currentHref} />
    </div>
  );
}

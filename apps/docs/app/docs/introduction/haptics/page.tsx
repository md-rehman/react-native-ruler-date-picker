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
  title: 'Haptic Feedback | react-native-ruler-date-picker',
  description: 'Configuration, velocity thresholds, and dual-speed tactile feedback in react-native-ruler-date-picker.',
};

export default function HapticsPage() {
  const currentHref = '/docs/introduction/haptics';

  return (
    <div>
      <DocHeader
        category="Introduction"
        badge="#tactile"
        title="Haptic Feedback"
        description="Physical rulers provide mechanical resistance and tactile clicks. react-native-ruler-date-picker replicates this sensation with an intelligent dual-speed haptic feedback engine."
      />

      <section style={{ marginBottom: 40 }}>
        <h2>1. The Dual-Speed Haptic Engine</h2>
        <p>
          Standard scroll pickers trigger a vibration on every single graduation, which creates a jarring, buzzing sensation during fast flings and quickly overheats or throttles the device's linear resonant actuator (Taptic Engine).
        </p>
        <p>
          Our built-in engine actively measures scroll velocity in real time and smoothly switches between two distinct tactile modes:
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, margin: '20px 0' }}>
          <div style={{ padding: 20, borderRadius: 'var(--radius-lg)', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}>
            <h4 style={{ margin: '0 0 8px 0', color: 'var(--color-accent)' }}>1. Discrete Snap Mode (Slow)</h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.5 }}>
              When panning slowly or aligning onto a graduation mark, a crisp <code>selectionAsync()</code> or light impact tap fires precisely as the needle crosses the tick boundary.
            </p>
          </div>

          <div style={{ padding: 20, borderRadius: 'var(--radius-lg)', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}>
            <h4 style={{ margin: '0 0 8px 0', color: '#10b981' }}>2. Rapid Buzz Mode (Fast Fling)</h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.5 }}>
              When velocity exceeds <code>speedThreshold</code> (default 800 px/s), haptics are intelligently throttled to a smooth, mechanical hum (every 40ms) until deceleration completes.
            </p>
          </div>
        </div>
      </section>

      <section style={{ marginBottom: 40 }}>
        <h2>2. Quick Setup</h2>
        <p>
          Install <code>expo-haptics</code> in your Expo or React Native project:
        </p>

        <CodeBlock
          title="Terminal"
          language="bash"
          code={`npx expo install expo-haptics`}
        />

        <p style={{ marginTop: 16 }}>
          Haptics are enabled by default. The package automatically detects whether <code>expo-haptics</code> is available; if absent or running on the web, it gracefully degrades to a silent no-op without runtime warnings.
        </p>
      </section>

      <section style={{ marginBottom: 40 }}>
        <h2>3. Advanced Configuration</h2>
        <p>
          Pass an object to the <code>haptics</code> prop to tune thresholds and vibration intensities:
        </p>

        <CodeBlock
          title="CustomHaptics.tsx"
          language="tsx"
          code={`import React, { useState } from 'react';
import { RulerDatePicker } from 'react-native-ruler-date-picker';

export default function CustomHaptics() {
  const [date, setDate] = useState(new Date());

  return (
    <RulerDatePicker
      value={date}
      onChange={setDate}
      haptics={{
        enabled: true,
        type: 'medium',        // 'light' | 'medium' | 'heavy' | 'selection'
        speedThreshold: 900,   // Velocity in px/s to trigger rapid buzz
        throttleMs: 35,        // Minimum ms between buzz pulses
      }}
    />
  );
}`}
        />
      </section>

      <section style={{ marginBottom: 40 }}>
        <h2>4. HapticConfig Options</h2>

        <PropsTable
          data={[
            {
              name: 'enabled',
              type: 'boolean',
              default: 'true',
              description: 'Globally toggle haptic vibrations on or off.',
            },
            {
              name: 'type',
              type: "'light' | 'medium' | 'heavy' | 'selection'",
              default: "'light'",
              description: 'The intensity profile for discrete tick boundary crossings.',
            },
            {
              name: 'speedThreshold',
              type: 'number',
              default: '800',
              description: 'Velocity in pixels/second above which rapid buzz throttling activates.',
            },
            {
              name: 'throttleMs',
              type: 'number',
              default: '40',
              description: 'Minimum delay in milliseconds between consecutive buzz vibrations during high-speed inertia.',
            },
            {
              name: 'customHapticTrigger',
              type: "(mode: 'step' | 'fast') => void",
              default: 'undefined',
              description: 'Custom haptic handler callback for bare React Native or non-Expo custom vibration libraries.',
            },
          ]}
        />
      </section>

      <section style={{ marginBottom: 40 }}>
        <h2>5. Custom Vibration Engine (Bare React Native)</h2>
        <p>
          If you are not using Expo and have your own native vibration library (e.g. <code>react-native-haptic-feedback</code>), pass <code>customHapticTrigger</code>:
        </p>

        <CodeBlock
          title="BareReactNative.tsx"
          language="tsx"
          code={`import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

<RulerDatePicker
  value={date}
  onChange={setDate}
  haptics={{
    customHapticTrigger: (mode) => {
      if (mode === 'step') {
        ReactNativeHapticFeedback.trigger('impactLight');
      } else {
        ReactNativeHapticFeedback.trigger('keyboardTap');
      }
    },
  }}
/>`}
        />
      </section>

      <DocPagination currentHref={currentHref} />
    </div>
  );
}

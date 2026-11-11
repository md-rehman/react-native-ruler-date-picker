import React from 'react';
import type { Metadata } from 'next';
import {
  DocHeader,
  Callout,
  CodeBlock,
  DocPagination,
} from '../../components/DocElements/DocElements';
import InlinePlayground from '../../components/InlinePlayground/InlinePlayground';

export const metadata: Metadata = {
  title: 'Getting Started | react-native-ruler-date-picker',
  description: 'Installation, peer dependencies, and quick setup guide for react-native-ruler-date-picker.',
};

export default function GettingStartedPage() {
  const currentHref = '/docs/getting-started';

  const quickStartJsx = `<RulerDatePicker
  value={selectedDate}
  onChange={(date, dateString) => {
    setSelectedDate(date);
    console.log('Selected Date:', dateString);
  }}
  ticks="calendar"
  header={{ showResetToToday: true }}
/>`;

  return (
    <div>
      <DocHeader
        category="Introduction"
        badge="#setup"
        title="Getting Started"
        description="A high-performance, customizable horizontal ruler date picker and scroll wheel for React Native & Expo — powered by Reanimated 3 decay physics, dual-speed haptics, and windowed rendering."
      />

      <section style={{ marginBottom: 40 }}>
        <h2>Quick Interactive Preview</h2>
        <p>
          Experience 60 FPS decay scrolling, snap alignment, and live state updates in the live canvas below:
        </p>

        <InlinePlayground
          title="Minimal RulerDatePicker"
          type="single"
          jsxCode={quickStartJsx}
          props={{
            ticks: 'calendar',
            header: { showResetToToday: true },
          }}
        />

        <div style={{ marginTop: 16 }}>
          <Callout type="tip" title="Try the Full Kitchensink on Your Phone">
            Want to feel the real hardware haptic feedback? Open the live{' '}
            <a
              href="https://snack.expo.dev/@md-rehman/ruler-date-picker---kitchensink"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--color-accent)', textDecoration: 'underline' }}
            >
              Kitchensink Expo Snack
            </a>{' '}
            or tap <strong>Test on Device</strong> in the navigation bar to scan the QR code with Expo Go.
          </Callout>
        </div>
      </section>

      <section style={{ marginBottom: 40 }}>
        <h2>1. Installation</h2>

        <CodeBlock
          title="Terminal"
          language="bash"
          code={`npm install react-native-ruler-date-picker
# or
yarn add react-native-ruler-date-picker
# or
pnpm add react-native-ruler-date-picker`}
        />

        <h3 style={{ marginTop: 24 }}>Peer Dependencies</h3>
        <p>
          Make sure you have these installed in your project:
        </p>

        <CodeBlock
          title="Terminal"
          language="bash"
          code={`npm install react-native-reanimated react-native-gesture-handler`}
        />

        <p style={{ marginTop: 16 }}>
          Optional (for haptic feedback):
        </p>

        <CodeBlock
          title="Terminal"
          language="bash"
          code={`npx expo install expo-haptics`}
        />
      </section>

      <section style={{ marginBottom: 40 }}>
        <h2>2. Configure Peer Dependencies</h2>

        <Callout type="info" title="Already using React Navigation or Expo Router?">
          If your project already has <code>react-native-reanimated</code> and <code>GestureHandlerRootView</code> configured at your root, you can skip this section and jump straight to <strong>Step 4: Minimal Working Example</strong>!
        </Callout>

        <h3 style={{ marginTop: 24 }}>Babel Configuration</h3>
        <p>
          For bare React Native CLI apps, add the Reanimated Babel plugin to your <code>babel.config.js</code>. Ensure it is listed as the <strong>very last</strong> plugin:
        </p>

        <CodeBlock
          title="babel.config.js"
          language="javascript"
          code={`module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    'react-native-reanimated/plugin', // MUST be last plugin
  ],
};`}
        />

        <Callout type="tip" title="Expo Projects (SDK 50+)">
          In Expo managed workflows using <code>babel-preset-expo</code>, the Reanimated Babel plugin is automatically applied out of the box — no manual changes to <code>babel.config.js</code> are required unless you have a custom Babel configuration.
        </Callout>

        <h3 style={{ marginTop: 24 }}>GestureHandlerRootView</h3>
        <p>
          Wrap your application root component with <code>GestureHandlerRootView</code> so gestures and pan physics function properly across iOS and Android:
        </p>

        <CodeBlock
          title="App.tsx (Standard React Native / Expo)"
          language="tsx"
          code={`import React from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import MainScreen from './MainScreen';

export default function App() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <MainScreen />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});`}
        />

        <p style={{ marginTop: 16 }}>
          Or if you are using <strong>Expo Router</strong>, wrap your root layout in <code>app/_layout.tsx</code>:
        </p>

        <CodeBlock
          title="app/_layout.tsx (Expo Router)"
          language="tsx"
          code={`import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Slot } from 'expo-router';
import { StyleSheet } from 'react-native';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <Slot />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});`}
        />

        <div style={{ marginTop: 20 }}>
          <Callout type="tip" title="Reset Metro Cache After Installing">
            Whenever you install Reanimated or modify your Babel configuration, always restart Metro with cache cleared to avoid stale bundle errors:
            <br />
            <code>npx expo start -c</code> &nbsp;or&nbsp; <code>npm start -- --reset-cache</code>
          </Callout>
        </div>
      </section>

      <section style={{ marginBottom: 40 }}>
        <h2>3. Optional: Expo Haptics Support</h2>
        <p>
          To enable tactile vibration feedback on iOS and Android when scrolling ticks, install <code>expo-haptics</code>:
        </p>

        <CodeBlock
          title="Terminal"
          language="bash"
          code={`npx expo install expo-haptics`}
        />

        <Callout type="info" title="Dual-Speed Haptics">
          The built-in haptic engine dynamically differentiates between slow deliberate steps (discrete snap) and fast scrolling flick gestures (continuous rapid buzz). If <code>expo-haptics</code> is not installed or running on Web, haptics automatically no-ops gracefully without errors.
        </Callout>
      </section>

      <section style={{ marginBottom: 40 }}>
        <h2>4. Minimal Working Example</h2>
        <p>
          Here is how to bind the picker to your component state:
        </p>

        <CodeBlock
          title="DatePickerScreen.tsx"
          language="tsx"
          code={`import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RulerDatePicker } from 'react-native-ruler-date-picker';

export default function DatePickerScreen() {
  const [date, setDate] = useState<Date>(new Date());

  return (
    <View style={styles.container}>
      <Text style={styles.selectedText}>
        Selected: {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
      </Text>

      <RulerDatePicker
        value={date}
        onChange={(selectedDate, dateString) => {
          setDate(selectedDate);
          console.log('Selected ISO Date:', dateString);
        }}
        ticks="calendar"
        header={{ showResetToToday: true }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0F172A',
  },
  selectedText: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 24,
  },
});`}
        />
      </section>

      <DocPagination currentHref={currentHref} />
    </div>
  );
}

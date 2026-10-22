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
      </section>

      <section style={{ marginBottom: 40 }}>
        <h2>1. Installation</h2>
        <p>
          Install <code>react-native-ruler-date-picker</code> along with its peer dependencies:
        </p>

        <CodeBlock
          title="Terminal"
          language="bash"
          code={`# Using pnpm
pnpm add react-native-ruler-date-picker react-native-reanimated react-native-gesture-handler

# Using npm
npm install react-native-ruler-date-picker react-native-reanimated react-native-gesture-handler

# Using yarn
yarn add react-native-ruler-date-picker react-native-reanimated react-native-gesture-handler

# Using Expo
npx expo install react-native-reanimated react-native-gesture-handler`}
        />
      </section>

      <section style={{ marginBottom: 40 }}>
        <h2>2. Configure Peer Dependencies</h2>

        <h3>Babel Configuration</h3>
        <p>
          Add the Reanimated Babel plugin to your <code>babel.config.js</code>. Ensure it is listed as the <strong>very last</strong> plugin:
        </p>

        <CodeBlock
          title="babel.config.js"
          language="javascript"
          code={`module.exports = {
  presets: ['module:@react-native/babel-preset'], // or 'babel-preset-expo'
  plugins: [
    'react-native-reanimated/plugin', // MUST be last plugin
  ],
};`}
        />

        <h3>GestureHandlerRootView</h3>
        <p>
          Wrap your app root component with <code>GestureHandlerRootView</code>:
        </p>

        <CodeBlock
          title="App.tsx"
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

        <Callout type="tip" title="Expo Projects">
          In Expo managed workflows (SDK 50+), <code>react-native-gesture-handler</code> and <code>react-native-reanimated</code> work out of the box after adding the plugin to <code>babel.config.js</code>.
        </Callout>
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
    backgroundColor: '#0F172A',
  },
});`}
        />
      </section>

      <DocPagination currentHref={currentHref} />
    </div>
  );
}

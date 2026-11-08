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
  title: 'Theming & Appearance | react-native-ruler-date-picker',
  description: 'Color tokens, automatic dark/light mode detection, and custom theme overrides.',
};

export default function ThemingPage() {
  const currentHref = '/docs/introduction/theming';

  const cyberThemeJsx = `<RulerDatePicker
  value={selectedDate}
  onChange={setSelectedDate}
  tickSpacing={28}
  theme={{
    background: '#09090B',
    indicatorColor: '#4ADE80',
    accentColor: '#22C55E',
    labelColor: '#F4F4F5',
    defaultTickColor: '#27272A',
  }}
/>`;

  return (
    <div>
      <DocHeader
        category="Introduction"
        badge="#theming"
        title="Theming & Appearance"
        description="react-native-ruler-date-picker features a streamlined design token system with seamless automatic Light and Dark mode switching."
      />

      <section style={{ marginBottom: 40 }}>
        <h2>1. Interactive Theme Customizer</h2>
        <p>
          Pass a <code>theme</code> prop containing any subset of color tokens. Unspecified tokens automatically fall back to the active system color scheme.
        </p>

        <InlinePlayground
          title="Cyber Emerald Theme"
          type="single"
          jsxCode={cyberThemeJsx}
          props={{
            tickSpacing: 28,
            theme: {
              background: '#09090B',
              indicatorColor: '#4ADE80',
              accentColor: '#22C55E',
              labelColor: '#F4F4F5',
              defaultTickColor: '#27272A',
            },
          }}
        />
      </section>

      <section style={{ marginBottom: 40 }}>
        <h2>2. Theme Tokens Reference</h2>
        <p>
          Every visual layer of the ruler is controlled by these 6 cohesive tokens:
        </p>

        <PropsTable
          data={[
            {
              name: 'background',
              type: 'string',
              default: "'transparent' / '#000000'",
              description: 'Background fill color for the ruler viewport arena.',
            },
            {
              name: 'indicatorColor',
              type: 'string',
              default: "'#007AFF' (Light) / '#0A84FF' (Dark)",
              description: 'Color of the center alignment needle (single picker) or draggable handles (range picker).',
            },
            {
              name: 'accentColor',
              type: 'string',
              default: "'#007AFF' (Light) / '#0A84FF' (Dark)",
              description: 'Tint applied to active tick markers, today jump button, and selected date badges.',
            },
            {
              name: 'labelColor',
              type: 'string',
              default: "'#1D1D1F' (Light) / '#F5F5F7' (Dark)",
              description: 'Primary text color for date numbers, month headers, and tick label texts.',
            },
            {
              name: 'defaultTickColor',
              type: 'string',
              default: "'#C7C7CC' (Light) / '#38383A' (Dark)",
              description: 'Color of standard baseline graduation tick lines.',
            },
            {
              name: 'rangeHighlightColor',
              type: 'string',
              default: "'rgba(10, 132, 255, 0.25)'",
              description: 'Tint of the connecting selection strip between start and end handles in RulerDateRangePicker.',
            },
          ]}
        />
      </section>

      <section style={{ marginBottom: 40 }}>
        <h2>3. Built-In Color Palettes</h2>
        <p>
          You can import the predefined palettes directly from the package:
        </p>

        <CodeBlock
          title="ThemePresets.tsx"
          language="tsx"
          code={`import { LIGHT_THEME, DARK_THEME, useResolvedTheme } from 'react-native-ruler-date-picker';

console.log(LIGHT_THEME.indicatorColor); // '#007AFF'
console.log(DARK_THEME.indicatorColor);  // '#0A84FF'`}
        />
      </section>

      <section style={{ marginBottom: 40 }}>
        <h2>4. The useResolvedTheme Hook</h2>
        <p>
          When authoring custom compound subcomponents, use <code>useResolvedTheme</code> to compute the final active palette merged with the current device color scheme:
        </p>

        <CodeBlock
          title="CustomHeader.tsx"
          language="tsx"
          code={`import React from 'react';
import { Text } from 'react-native';
import { useResolvedTheme, RulerTheme } from 'react-native-ruler-date-picker';

export function CustomHeader({ theme }: { theme?: RulerTheme }) {
  const resolved = useResolvedTheme(theme);

  return (
    <Text style={{ color: resolved.labelColor, fontSize: 18, fontWeight: '700' }}>
      Selected Milestone
    </Text>
  );
}`}
        />

        <Callout type="tip" title="Automatic Re-render on System Theme Change">
          <code>useResolvedTheme</code> internally listens to React Native's <code>useColorScheme()</code>, immediately updating tints when the user toggles iOS/Android system dark mode.
        </Callout>
      </section>

      <DocPagination currentHref={currentHref} />
    </div>
  );
}

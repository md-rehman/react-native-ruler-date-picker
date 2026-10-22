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
  title: 'useRulerDatePicker Hook | react-native-ruler-date-picker',
  description: 'Headless hook managing Reanimated 3 decay physics, snapping, and tick windowing.',
};

export default function UseRulerDatePickerPage() {
  const currentHref = '/docs/hooks/use-ruler-date-picker';

  return (
    <div>
      <DocHeader
        category="Hooks"
        badge="#headless"
        title="useRulerDatePicker"
        description="The headless engine powering RulerDatePicker. Provides low-level Reanimated 3 shared values, gesture physics, and programmatic scroll methods."
      />

      <section style={{ marginBottom: 40 }}>
        <h2>1. Why Headless?</h2>
        <p>
          If our pre-packaged compound components do not match your exact creative vision (e.g. a vertical timeline, a circular dial, or a carousel overlay), <code>useRulerDatePicker</code> gives you raw physics and windowing math with zero layout assumptions.
        </p>

        <CodeBlock
          title="HeadlessExample.tsx"
          language="tsx"
          code={`import React from 'react';
import { View, Text } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { useRulerDatePicker } from 'react-native-ruler-date-picker';

export function CustomRuler() {
  const {
    panGesture,
    scrollX,
    activeDateString,
    scrollToDate,
    resetToToday,
    visibleIndices,
  } = useRulerDatePicker({
    initialDate: new Date(),
    tickSpacing: 30,
    onChange: (date, str) => console.log('Active Date:', str),
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: scrollX.value }],
  }));

  return (
    <View>
      <Text>Active Date: {activeDateString}</Text>
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[{ flexDirection: 'row' }, animatedStyle]}>
          {visibleIndices.map((idx) => (
            <View key={idx} style={{ width: 30, height: 40, borderLeftWidth: 1 }} />
          ))}
        </Animated.View>
      </GestureDetector>
    </View>
  );
}`}
        />
      </section>

      <section style={{ marginBottom: 40 }}>
        <h2>2. Hook Parameters</h2>

        <PropsTable
          data={[
            {
              name: 'value',
              type: 'Date | string',
              description: 'Controlled date value.',
            },
            {
              name: 'onChange',
              type: '(date: Date, dateString: string) => void',
              description: 'Callback executed whenever snap alignment settles on a new day offset.',
            },
            {
              name: 'minDate / maxDate',
              type: 'Date | string',
              description: 'Optional date boundary clamps.',
            },
            {
              name: 'tickSpacing',
              type: 'number',
              default: '24',
              description: 'Pixel distance between adjacent day graduations.',
            },
            {
              name: 'bufferTicks',
              type: 'number',
              default: '5',
              description: 'Extra ticks rendered outside viewport edges to prevent blank flashes during high-speed inertia.',
            },
            {
              name: 'haptics',
              type: 'boolean | HapticConfig',
              default: 'true',
              description: 'Haptic feedback configuration.',
            },
          ]}
        />
      </section>

      <section style={{ marginBottom: 40 }}>
        <h2>3. Return Signature</h2>

        <PropsTable
          data={[
            {
              name: 'scrollX',
              type: 'SharedValue<number>',
              description: 'Continuous Reanimated 3 horizontal pixel translation value.',
            },
            {
              name: 'activeIndex',
              type: 'SharedValue<number>',
              description: 'Current day index relative to reference date.',
            },
            {
              name: 'panGesture',
              type: 'PanGesture',
              description: 'Configured Gesture Handler with decay velocity physics and snap interpolation.',
            },
            {
              name: 'scrollToDate',
              type: '(target: Date | string, animated?: boolean) => void',
              description: 'Imperatively scroll and snap the ruler to any arbitrary date.',
            },
            {
              name: 'resetToToday',
              type: '(animated?: boolean) => void',
              description: 'Smoothly spring the ruler back to today.',
            },
            {
              name: 'activeDateString',
              type: 'string',
              description: 'Formatted local YYYY-MM-DD string of currently centered date.',
            },
            {
              name: 'visibleIndices',
              type: 'number[]',
              description: 'Array of day offsets currently visible in the calculated viewport window.',
            },
          ]}
        />
      </section>

      <DocPagination currentHref={currentHref} />
    </div>
  );
}

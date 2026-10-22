import React from 'react';
import type { Metadata } from 'next';
import {
  DocHeader,
  Callout,
  CodeBlock,
  DocPagination,
} from '../../../components/DocElements/DocElements';

export const metadata: Metadata = {
  title: 'Compound Contexts | react-native-ruler-date-picker',
  description: 'useRulerContext and useRulerRangeContext for building bespoke compound components.',
};

export default function ContextsPage() {
  const currentHref = '/docs/hooks/contexts';

  return (
    <div>
      <DocHeader
        category="Hooks"
        badge="#context"
        title="Compound Contexts"
        description="Access Reanimated shared values, active dates, and layout metrics anywhere inside your compound component tree."
      />

      <section style={{ marginBottom: 40 }}>
        <h2>1. useRulerContext</h2>
        <p>
          Any component nested inside <code>&lt;Ruler.Root&gt;</code> or <code>&lt;RulerRoot&gt;</code> can call <code>useRulerContext()</code> to hook into the single-date picker state:
        </p>

        <CodeBlock
          title="CustomDayCounter.tsx"
          language="tsx"
          code={`import React from 'react';
import { View, Text } from 'react-native';
import { useRulerContext } from 'react-native-ruler-date-picker';

export function CustomDayCounter() {
  const { activeDate, activeDateString, resetToToday, theme } = useRulerContext();

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 12 }}>
      <Text style={{ color: theme.labelColor, fontWeight: '700' }}>
        Selected: {activeDateString}
      </Text>
      <Text
        onPress={() => resetToToday()}
        style={{ color: theme.accentColor, fontWeight: '600' }}
      >
        Reset
      </Text>
    </View>
  );
}`}
        />
      </section>

      <section style={{ marginBottom: 40 }}>
        <h2>2. useRulerRangeContext</h2>
        <p>
          Similarly, components nested inside <code>&lt;RulerRange.Root&gt;</code> can call <code>useRulerRangeContext()</code>:
        </p>

        <CodeBlock
          title="CustomRangeDuration.tsx"
          language="tsx"
          code={`import React from 'react';
import { Text } from 'react-native';
import { useRulerRangeContext } from 'react-native-ruler-date-picker';

export function CustomRangeDuration() {
  const { days, startDate, endDate, theme } = useRulerRangeContext();

  return (
    <Text style={{ color: theme.accentColor, fontWeight: 'bold' }}>
      {days} Nights Selected
    </Text>
  );
}`}
        />

        <Callout type="warning" title="Provider Constraint">
          Calling <code>useRulerContext</code> or <code>useRulerRangeContext</code> outside of their respective Root component will throw a descriptive invariant error to safeguard against missing shared values.
        </Callout>
      </section>

      <DocPagination currentHref={currentHref} />
    </div>
  );
}

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
  title: 'Compound Contexts | react-native-ruler-date-picker',
  description: 'useRulerContext and useRulerRangeContext for building bespoke compound components.',
};

export default function ContextsPage() {
  const currentHref = '/docs/hooks/contexts';

  const contextJsx = `import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ruler, useRulerContext } from 'react-native-ruler-date-picker';

function CustomHeaderBar() {
  const { selectedDateStr, resetToToday, theme } = useRulerContext();

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', paddingHorizontal: 20 }}>
      <Text style={{ color: theme.labelColor, fontWeight: '700' }}>
        Selected: <Text style={{ color: theme.accentColor }}>{selectedDateStr}</Text>
      </Text>
      <TouchableOpacity onPress={() => resetToToday(true)}>
        <Text style={{ color: theme.accentColor, fontWeight: '600' }}>Reset</Text>
      </TouchableOpacity>
    </View>
  );
}

export function CustomPicker() {
  return (
    <Ruler.Root>
      <CustomHeaderBar />
      <Ruler.Track />
    </Ruler.Root>
  );
}`;

  const rangeContextJsx = `import React from 'react';
import { View, Text } from 'react-native';
import { RulerRange, useRulerRangeContext } from 'react-native-ruler-date-picker';

function CustomRangeDuration() {
  const { spanDays, startDateStr, endDateStr, theme } = useRulerRangeContext();

  return (
    <View style={{ alignItems: 'center', marginBottom: 12 }}>
      <Text style={{ color: theme.accentColor, fontWeight: '800', fontSize: 16 }}>
        {spanDays} Nights Selected
      </Text>
      <Text style={{ color: '#8E8E93', fontSize: 12 }}>
        {startDateStr} ➔ {endDateStr}
      </Text>
    </View>
  );
}

export function RangePicker() {
  return (
    <RulerRange.Root>
      <CustomRangeDuration />
      <RulerRange.Track />
    </RulerRange.Root>
  );
}`;

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

        <InlinePlayground
          title="Context Consumer (useRulerContext)"
          type="context"
          jsxCode={contextJsx}
          props={{
            tickSpacing: 26,
            rulerHeight: 64,
          }}
        />
      </section>

      <section style={{ marginBottom: 40 }}>
        <h2>2. useRulerRangeContext</h2>
        <p>
          Similarly, components nested inside <code>&lt;RulerRange.Root&gt;</code> can call <code>useRulerRangeContext()</code>:
        </p>

        <InlinePlayground
          title="Range Context Consumer (useRulerRangeContext)"
          type="range-context"
          jsxCode={rangeContextJsx}
          props={{
            tickSpacing: 26,
            rulerHeight: 64,
          }}
        />

        <div style={{ marginTop: 24 }}>
          <Callout type="warning" title="Provider Constraint">
            Calling <code>useRulerContext</code> or <code>useRulerRangeContext</code> outside of their respective Root component will throw a descriptive invariant error to safeguard against missing shared values.
          </Callout>
        </div>
      </section>

      <DocPagination currentHref={currentHref} />
    </div>
  );
}

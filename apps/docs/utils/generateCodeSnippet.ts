import { ComponentType } from '../data/examples';

export type SnippetMode = 'full' | 'jsx';

export interface GenerateCodeOptions {
  props: Record<string, any>;
  presetName?: string;
  componentType?: ComponentType;
  mode?: SnippetMode;
}

export function generateCodeSnippet({
  props,
  presetName = 'Custom Configuration',
  componentType = 'RulerDatePicker',
  mode = 'full',
}: GenerateCodeOptions): string {
  const cleanProps = { ...props };
  delete cleanProps.value;

  const propLines: string[] = [];

  // Helper to serialize ticks
  const formatTicksProp = (ticks: any): string | null => {
    if (!ticks) return null;
    if (typeof ticks === 'string') return `      ticks="${ticks}"`;
    if (Array.isArray(ticks)) {
      const formattedRules = ticks
        .map((rule: any) => {
          const parts: string[] = [];
          if (rule.condition) {
            if (typeof rule.condition === 'string') {
              parts.push(`condition: '${rule.condition}'`);
            } else {
              parts.push(`condition: ${JSON.stringify(rule.condition)}`);
            }
          }
          parts.push(`height: ${rule.height}`);
          if (rule.width !== undefined) parts.push(`width: ${rule.width}`);
          if (rule.color) parts.push(`color: '${rule.color}'`);
          if (rule.label) parts.push(`label: true`);
          if (rule.dot) parts.push(`dot: true`);
          return `        { ${parts.join(', ')} },`;
        })
        .join('\n');
      return `      ticks={[\n${formattedRules}\n      ]}`;
    }
    return null;
  };

  // ── Range Picker Code Generation ──────────────────────────────────────
  if (componentType === 'RulerDateRangePicker') {
    propLines.push('      value={range}');
    propLines.push('      onChange={({ startDate, endDate }) => {');
    propLines.push('        setRange({ start: startDate, end: endDate });');
    propLines.push('      }}');

    if (cleanProps.minSpanDays !== undefined) {
      propLines.push(`      minSpanDays={${cleanProps.minSpanDays}}`);
    }
    if (cleanProps.maxSpanDays !== undefined) {
      propLines.push(`      maxSpanDays={${cleanProps.maxSpanDays}}`);
    }
    if (cleanProps.minDate) {
      propLines.push(`      minDate="${cleanProps.minDate}"`);
    }
    if (cleanProps.maxDate) {
      propLines.push(`      maxDate="${cleanProps.maxDate}"`);
    }
    if (cleanProps.locale) {
      propLines.push(`      locale="${cleanProps.locale}"`);
    }

    const ticksLine = formatTicksProp(cleanProps.ticks);
    if (ticksLine) propLines.push(ticksLine);

    if (cleanProps.width !== undefined) {
      propLines.push(`      width={${cleanProps.width}}`);
    }
    if (cleanProps.tickSpacing !== undefined) {
      propLines.push(`      tickSpacing={${cleanProps.tickSpacing}}`);
    }
    if (cleanProps.tickWidth !== undefined) {
      propLines.push(`      tickWidth={${cleanProps.tickWidth}}`);
    }
    if (cleanProps.rulerHeight !== undefined) {
      propLines.push(`      rulerHeight={${cleanProps.rulerHeight}}`);
    }

    if (cleanProps.highlight === false) {
      propLines.push('      highlight={false}');
    }

    if (cleanProps.header === false) {
      propLines.push('      header={false}');
    }

    if (cleanProps.theme && typeof cleanProps.theme === 'object') {
      const themeLines = Object.entries(cleanProps.theme)
        .filter(([, v]) => v !== undefined && v !== '')
        .map(([k, v]) => `        ${k}: '${v}',`)
        .join('\n');
      propLines.push(`      theme={{\n${themeLines}\n      }}`);
    }

    if (cleanProps.haptics === false) {
      propLines.push('      haptics={false}');
    }

    const jsxSnippet = [
      '    <RulerDateRangePicker',
      ...propLines,
      '    />',
    ].join('\n');

    if (mode === 'jsx') {
      return [
        '<RulerDateRangePicker',
        ...propLines.map((line) => line.slice(4)),
        '/>',
      ].join('\n');
    }

    const componentName = presetName
      .replace(/[^a-zA-Z0-9]/g, '')
      .concat('RangePicker')
      .replace(/^([a-z])/, (m) => m.toUpperCase());

    const bgColor = cleanProps.theme?.background || '#0F172A';

    return `import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { RulerDateRangePicker, DateRange } from 'react-native-ruler-date-picker';

export default function ${componentName}() {
  const [range, setRange] = useState<DateRange>({
    start: new Date(),
    end: new Date(Date.now() + 7 * 86400000),
  });

  return (
    <View style={styles.container}>
${jsxSnippet}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '${bgColor}',
  },
});
`;
  }

  // ── Compound Single Code Generation ───────────────────────────────────
  if (componentType === 'RulerCompound') {
    const bgColor = cleanProps.theme?.background || '#111827';
    if (mode === 'jsx') {
      return `<RulerRoot
  value={selectedDate}
  onChange={(date) => setSelectedDate(date)}
  tickSpacing={${cleanProps.tickSpacing ?? 26}}
  rulerHeight={${cleanProps.rulerHeight ?? 64}}
>
  <RulerHeader showResetToToday={false} />
  <RulerTrack>
    <RulerIndicator />
    <RulerTicks />
  </RulerTrack>
  <RulerResetButton />
</RulerRoot>`;
    }

    return `import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  RulerRoot,
  RulerHeader,
  RulerTrack,
  RulerIndicator,
  RulerTicks,
  RulerResetButton,
} from 'react-native-ruler-date-picker';

export default function RulerCompoundDemo() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  return (
    <View style={styles.container}>
      <RulerRoot
        value={selectedDate}
        onChange={(date) => setSelectedDate(date)}
        tickSpacing={${cleanProps.tickSpacing ?? 26}}
        rulerHeight={${cleanProps.rulerHeight ?? 64}}
      >
        <RulerHeader showResetToToday={false} />
        <RulerTrack>
          <RulerIndicator />
          <RulerTicks />
        </RulerTrack>
        <RulerResetButton />
      </RulerRoot>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '${bgColor}',
  },
});
`;
  }

  // ── Compound Range Code Generation ────────────────────────────────────
  if (componentType === 'RulerRangeCompound') {
    const bgColor = cleanProps.theme?.background || '#18181B';
    if (mode === 'jsx') {
      return `<RulerRangeRoot
  value={range}
  onChange={({ startDate, endDate }) => setRange({ start: startDate, end: endDate })}
  minSpanDays={${cleanProps.minSpanDays ?? 2}}
  maxSpanDays={${cleanProps.maxSpanDays ?? 14}}
  tickSpacing={${cleanProps.tickSpacing ?? 26}}
  rulerHeight={${cleanProps.rulerHeight ?? 64}}
>
  <RulerRangeHeader />
  <RulerRangeTrack />
</RulerRangeRoot>`;
    }

    return `import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  RulerRangeRoot,
  RulerRangeHeader,
  RulerRangeTrack,
  DateRange,
} from 'react-native-ruler-date-picker';

export default function RulerRangeCompoundDemo() {
  const [range, setRange] = useState<DateRange>({
    start: new Date(),
    end: new Date(Date.now() + 6 * 86400000),
  });

  return (
    <View style={styles.container}>
      <RulerRangeRoot
        value={range}
        onChange={({ startDate, endDate }) => setRange({ start: startDate, end: endDate })}
        minSpanDays={${cleanProps.minSpanDays ?? 2}}
        maxSpanDays={${cleanProps.maxSpanDays ?? 14}}
        tickSpacing={${cleanProps.tickSpacing ?? 26}}
        rulerHeight={${cleanProps.rulerHeight ?? 64}}
      >
        <RulerRangeHeader />
        <RulerRangeTrack />
      </RulerRangeRoot>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '${bgColor}',
  },
});
`;
  }

  // ── Headless Single Hook Code Generation ──────────────────────────────
  if (componentType === 'useRulerDatePicker') {
    return `import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useRulerDatePicker, formatDateString } from 'react-native-ruler-date-picker';

export default function HeadlessRulerDemo() {
  const {
    selectedDate,
    selectedDateStr,
    resetToToday,
    scrollToDate,
  } = useRulerDatePicker({
    tickSpacing: ${cleanProps.tickSpacing ?? 24},
  });

  return (
    <View style={styles.container}>
      <Text style={styles.readout}>{selectedDateStr || formatDateString(selectedDate)}</Text>
      <TouchableOpacity onPress={() => resetToToday(true)} style={styles.btn}>
        <Text style={styles.btnText}>Jump to Today</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '${cleanProps.theme?.background || '#131722'}',
  },
  readout: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '${cleanProps.theme?.labelColor || '#F8FAFC'}',
    marginBottom: 16,
  },
  btn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '${cleanProps.theme?.accentColor || '#38BDF8'}',
  },
  btnText: {
    color: '#000',
    fontWeight: '600',
  },
});
`;
  }

  // ── Headless Range Hook Code Generation ───────────────────────────────
  if (componentType === 'useRulerDateRangePicker') {
    return `import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useRulerDateRangePicker, formatDateString } from 'react-native-ruler-date-picker';

export default function HeadlessRangeDemo() {
  const {
    activeHandle,
    startDate,
    endDate,
    spanDays,
    scrollToHandle,
  } = useRulerDateRangePicker({
    minSpanDays: ${cleanProps.minSpanDays ?? 2},
    maxSpanDays: ${cleanProps.maxSpanDays ?? 20},
    tickSpacing: ${cleanProps.tickSpacing ?? 24},
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {formatDateString(startDate)} → {formatDateString(endDate)}
      </Text>
      <Text style={styles.subtitle}>Span: {spanDays} days | Active: {activeHandle}</Text>
      <View style={styles.actions}>
        <TouchableOpacity onPress={() => scrollToHandle('start')} style={styles.btn}>
          <Text style={styles.btnText}>Focus Start</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => scrollToHandle('end')} style={styles.btn}>
          <Text style={styles.btnText}>Focus End</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '${cleanProps.theme?.background || '#161924'}',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '${cleanProps.theme?.labelColor || '#F1F5F9'}',
  },
  subtitle: {
    fontSize: 14,
    color: '${cleanProps.theme?.indicatorColor || '#10B981'}',
    marginVertical: 12,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  btn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: '${cleanProps.theme?.accentColor || '#10B981'}',
  },
  btnText: {
    color: '#000',
    fontWeight: '600',
  },
});
`;
  }

  // ── Default: RulerDatePicker ──────────────────────────────────────────
  propLines.push('      value={selectedDate}');
  propLines.push('      onChange={(date) => setSelectedDate(date)}');

  if (cleanProps.minDate) {
    propLines.push(`      minDate="${cleanProps.minDate}"`);
  }
  if (cleanProps.maxDate) {
    propLines.push(`      maxDate="${cleanProps.maxDate}"`);
  }
  if (cleanProps.locale) {
    propLines.push(`      locale="${cleanProps.locale}"`);
  }

  const ticksLine = formatTicksProp(cleanProps.ticks);
  if (ticksLine) propLines.push(ticksLine);

  if (cleanProps.width !== undefined) {
    propLines.push(`      width={${cleanProps.width}}`);
  }
  if (cleanProps.tickSpacing !== undefined) {
    propLines.push(`      tickSpacing={${cleanProps.tickSpacing}}`);
  }
  if (cleanProps.tickWidth !== undefined) {
    propLines.push(`      tickWidth={${cleanProps.tickWidth}}`);
  }
  if (cleanProps.rulerHeight !== undefined) {
    propLines.push(`      rulerHeight={${cleanProps.rulerHeight}}`);
  }
  if (cleanProps.indicator === false) {
    propLines.push('      indicator={false}');
  } else if (cleanProps.indicator && typeof cleanProps.indicator === 'object') {
    const indEntries = Object.entries(cleanProps.indicator)
      .filter(([, v]) => v !== undefined)
      .map(([k, v]) => `${k}: ${typeof v === 'string' ? `'${v}'` : Array.isArray(v) ? JSON.stringify(v) : v}`);
    if (indEntries.length > 0) {
      propLines.push(`      indicator={{ ${indEntries.join(', ')} }}`);
    }
  }

  if (cleanProps.theme && typeof cleanProps.theme === 'object') {
    const themeLines = Object.entries(cleanProps.theme)
      .filter(([, v]) => v !== undefined && v !== '')
      .map(([k, v]) => `        ${k}: '${v}',`)
      .join('\n');
    propLines.push(`      theme={{\n${themeLines}\n      }}`);
  }

  if (cleanProps.header === false || cleanProps.showHeader === false) {
    propLines.push(`      header={false}`);
  } else if (cleanProps.header && typeof cleanProps.header === 'object') {
    const headerEntries = Object.entries(cleanProps.header)
      .filter(([, v]) => v !== undefined)
      .map(([k, v]) => `${k}: ${typeof v === 'string' ? `'${v}'` : v}`);
    if (headerEntries.length > 0) {
      propLines.push(`      header={{ ${headerEntries.join(', ')} }}`);
    }
  } else if (cleanProps.showResetToToday) {
    propLines.push(`      header={{ showResetToToday: true }}`);
  }

  if (cleanProps.lensEffect) {
    if (typeof cleanProps.lensEffect === 'object') {
      const lensProps = Object.entries(cleanProps.lensEffect)
        .map(([k, v]) => `        ${k}: ${v},`)
        .join('\n');
      propLines.push(`      lensEffect={{\n${lensProps}\n      }}`);
    } else {
      propLines.push(`      lensEffect={true}`);
    }
  }

  if (cleanProps.haptics === false || cleanProps.enableHaptics === false) {
    propLines.push(`      haptics={false}`);
  }

  if (cleanProps.accessibilityLabel) {
    propLines.push(`      accessibilityLabel="${cleanProps.accessibilityLabel}"`);
  }

  const jsxSnippet = [
    '    <RulerDatePicker',
    ...propLines,
    '    />',
  ].join('\n');

  if (mode === 'jsx') {
    return [
      '<RulerDatePicker',
      ...propLines.map((line) => line.slice(4)),
      '/>',
    ].join('\n');
  }

  const componentName = presetName
    .replace(/[^a-zA-Z0-9]/g, '')
    .concat('Picker')
    .replace(/^([a-z])/, (m) => m.toUpperCase());

  const bgColor = cleanProps.theme?.background || '#0F172A';

  return `import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { RulerDatePicker } from 'react-native-ruler-date-picker';

export default function ${componentName}() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  return (
    <View style={styles.container}>
${jsxSnippet}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '${bgColor}',
  },
});
`;
}

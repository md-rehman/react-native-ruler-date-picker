export type SnippetMode = 'full' | 'jsx';

export interface GenerateCodeOptions {
  props: Record<string, any>;
  presetName?: string;
  mode?: SnippetMode;
}

export function generateCodeSnippet({
  props,
  presetName = 'Custom Configuration',
  mode = 'full',
}: GenerateCodeOptions): string {
  const {
    value: _ignoredValue,
    ...cleanProps
  } = props;

  const propLines: string[] = [];

  // Core value & onChange handlers
  propLines.push('      value={selectedDate}');
  propLines.push('      onChange={(date) => setSelectedDate(date)}');

  // Boundaries (minDate / maxDate)
  if (cleanProps.minDate) {
    propLines.push(`      minDate="${cleanProps.minDate}"`);
  }
  if (cleanProps.maxDate) {
    propLines.push(`      maxDate="${cleanProps.maxDate}"`);
  }

  // 1. Ticks configuration
  if (cleanProps.ticks) {
    if (typeof cleanProps.ticks === 'string') {
      propLines.push(`      ticks="${cleanProps.ticks}"`);
    } else if (Array.isArray(cleanProps.ticks)) {
      const formattedRules = cleanProps.ticks
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
      propLines.push(`      ticks={[\n${formattedRules}\n      ]}`);
    }
  }

  // 2. Dimensions
  if (cleanProps.tickSpacing !== undefined) {
    propLines.push(`      tickSpacing={${cleanProps.tickSpacing}}`);
  }
  if (cleanProps.tickThickness !== undefined) {
    propLines.push(`      tickThickness={${cleanProps.tickThickness}}`);
  }
  if (cleanProps.height !== undefined) {
    propLines.push(`      height={${cleanProps.height}}`);
  }
  if (cleanProps.rulerHeight !== undefined) {
    propLines.push(`      rulerHeight={${cleanProps.rulerHeight}}`);
  }
  if (cleanProps.indicatorWidth !== undefined) {
    propLines.push(`      indicatorWidth={${cleanProps.indicatorWidth}}`);
  }
  if (cleanProps.indicatorHeight !== undefined) {
    propLines.push(`      indicatorHeight={${cleanProps.indicatorHeight}}`);
  }

  // 3. Theme Object (v0.2.0 standardized theme token grouping)
  if (cleanProps.theme && typeof cleanProps.theme === 'object') {
    const themeLines = Object.entries(cleanProps.theme)
      .filter(([_, v]) => v !== undefined && v !== '')
      .map(([k, v]) => `        ${k}: '${v}',`)
      .join('\n');
    propLines.push(`      theme={{\n${themeLines}\n      }}`);
  }

  // 4. Feature Flags & Haptics
  if (cleanProps.showHeader !== undefined && !cleanProps.showHeader) {
    propLines.push(`      showHeader={false}`);
  }
  if (cleanProps.showResetToToday !== undefined && cleanProps.showResetToToday) {
    propLines.push(`      showResetToToday={true}`);
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
  if (cleanProps.enableHaptics !== undefined && !cleanProps.enableHaptics) {
    propLines.push(`      enableHaptics={false}`);
  }
  if (cleanProps.debounceMs !== undefined && cleanProps.debounceMs !== 100) {
    propLines.push(`      debounceMs={${cleanProps.debounceMs}}`);
  }
  if (cleanProps.bufferTicks !== undefined && cleanProps.bufferTicks !== 10) {
    propLines.push(`      bufferTicks={${cleanProps.bufferTicks}}`);
  }
  if (cleanProps.fastSwipeTickThreshold !== undefined && cleanProps.fastSwipeTickThreshold !== 1) {
    propLines.push(`      fastSwipeTickThreshold={${cleanProps.fastSwipeTickThreshold}}`);
  }
  if (cleanProps.continuousHapticIntervalMs !== undefined && cleanProps.continuousHapticIntervalMs !== 20) {
    propLines.push(`      continuousHapticIntervalMs={${cleanProps.continuousHapticIntervalMs}}`);
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

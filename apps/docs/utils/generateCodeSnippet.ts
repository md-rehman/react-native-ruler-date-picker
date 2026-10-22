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

  // Boundaries (minDate / maxDate) & locale
  if (cleanProps.minDate) {
    propLines.push(`      minDate="${cleanProps.minDate}"`);
  }
  if (cleanProps.maxDate) {
    propLines.push(`      maxDate="${cleanProps.maxDate}"`);
  }
  if (cleanProps.locale) {
    propLines.push(`      locale="${cleanProps.locale}"`);
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

  // 2. Dimensions & Indicator
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
      .filter(([_, v]) => v !== undefined)
      .map(([k, v]) => `${k}: ${typeof v === 'string' ? `'${v}'` : v}`);
    if (indEntries.length > 0) {
      propLines.push(`      indicator={{ ${indEntries.join(', ')} }}`);
    }
  } else if (cleanProps.indicatorWidth !== undefined || cleanProps.indicatorHeight !== undefined) {
    const parts: string[] = [];
    if (cleanProps.indicatorWidth !== undefined) parts.push(`width: ${cleanProps.indicatorWidth}`);
    if (cleanProps.indicatorHeight !== undefined) parts.push(`height: ${cleanProps.indicatorHeight}`);
    propLines.push(`      indicator={{ ${parts.join(', ')} }}`);
  }

  // 3. Theme Object (v0.2.0 standardized theme token grouping)
  if (cleanProps.theme && typeof cleanProps.theme === 'object') {
    const themeLines = Object.entries(cleanProps.theme)
      .filter(([_, v]) => v !== undefined && v !== '')
      .map(([k, v]) => `        ${k}: '${v}',`)
      .join('\n');
    propLines.push(`      theme={{\n${themeLines}\n      }}`);
  }

  // 4. Header & Feature Flags
  if (cleanProps.header === false || cleanProps.showHeader === false) {
    propLines.push(`      header={false}`);
  } else if (cleanProps.header && typeof cleanProps.header === 'object') {
    const headerEntries = Object.entries(cleanProps.header)
      .filter(([_, v]) => v !== undefined)
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
  } else if (cleanProps.haptics && typeof cleanProps.haptics === 'object') {
    const hapticEntries = Object.entries(cleanProps.haptics)
      .filter(([_, v]) => v !== undefined)
      .map(([k, v]) => `${k}: ${typeof v === 'string' ? `'${v}'` : v}`);
    if (hapticEntries.length > 0) {
      propLines.push(`      haptics={{ ${hapticEntries.join(', ')} }}`);
    }
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

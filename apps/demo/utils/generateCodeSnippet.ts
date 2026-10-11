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
    selectedDate: _ignoredDate,
    ...cleanProps
  } = props;

  const propLines: string[] = [];

  // Core value & onChange handlers
  propLines.push('      value={selectedDate}');
  propLines.push('      onChange={(date) => setSelectedDate(date)}');

  // 1. Ticks configuration
  if (cleanProps.ticks) {
    if (typeof cleanProps.ticks === 'string') {
      propLines.push(`      ticks="${cleanProps.ticks}"`);
    } else if (Array.isArray(cleanProps.ticks)) {
      const formattedRules = JSON.stringify(cleanProps.ticks, null, 2)
        .split('\n')
        .map((line, idx) => (idx === 0 ? line : `      ${line}`))
        .join('\n');
      propLines.push(`      ticks={${formattedRules}}`);
    }
  } else if (
    cleanProps.labelInterval &&
    cleanProps.labelInterval !== 'weekly'
  ) {
    propLines.push(`      ticks="calendar"`);
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

  // 3. Theme Object (v0.2.0 standardized theme token grouping)
  if (cleanProps.theme && typeof cleanProps.theme === 'object') {
    const themeLines = Object.entries(cleanProps.theme)
      .map(([k, v]) => `        ${k}: '${v}',`)
      .join('\n');
    propLines.push(`      theme={{\n${themeLines}\n      }}`);
  } else {
    // Group flat color props into the standardized theme object
    const themeEntries: [string, string][] = [];
    if (cleanProps.backgroundColor) themeEntries.push(['background', cleanProps.backgroundColor]);
    if (cleanProps.indicatorColor) themeEntries.push(['indicatorColor', cleanProps.indicatorColor]);
    if (cleanProps.accentColor) themeEntries.push(['accentColor', cleanProps.accentColor]);
    if (cleanProps.labelColor) themeEntries.push(['labelColor', cleanProps.labelColor]);
    if (cleanProps.tickColor) themeEntries.push(['defaultTickColor', cleanProps.tickColor]);

    if (themeEntries.length > 0) {
      const themeLines = themeEntries
        .map(([k, v]) => `        ${k}: '${v}',`)
        .join('\n');
      propLines.push(`      theme={{\n${themeLines}\n      }}`);
    }
  }

  // 4. Feature Flags
  if (cleanProps.enableHaptics !== undefined) {
    propLines.push(`      enableHaptics={${cleanProps.enableHaptics}}`);
  }
  if (cleanProps.showResetToToday !== undefined) {
    propLines.push(`      showResetToToday={${cleanProps.showResetToToday}}`);
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

  const bgColor = cleanProps.backgroundColor || '#0F172A';

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

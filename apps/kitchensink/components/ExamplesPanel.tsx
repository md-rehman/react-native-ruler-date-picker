import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { EXAMPLES, ExamplePreset } from '../data/examples';
import { ExampleListItem } from './ExampleListItem';
import { SPACING } from '../theme/tokens';

interface ExamplesPanelProps {
  activeExampleId: string;
  onSelectExample: (preset: ExamplePreset) => void;
}

export const ExamplesPanel: React.FC<ExamplesPanelProps> = ({
  activeExampleId,
  onSelectExample,
}) => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {EXAMPLES.map((example) => (
        <ExampleListItem
          key={example.id}
          example={example}
          isActive={activeExampleId === example.id}
          onSelect={() => onSelectExample(example)}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.xs,
  },
  content: {
    paddingBottom: SPACING.md,
  },
});

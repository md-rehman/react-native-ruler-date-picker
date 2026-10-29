import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { EXAMPLE_SECTIONS, ExamplePreset } from '../data/examples';
import { ExampleListItem } from './ExampleListItem';
import { ExperimentalBadge } from './ExperimentalBadge/ExperimentalBadge';
import { useTheme } from '../context/ThemeContext';
import { SPACING } from '../theme/tokens';

interface ExamplesPanelProps {
  activeExampleId: string;
  onSelectExample: (preset: ExamplePreset) => void;
}

export const ExamplesPanel: React.FC<ExamplesPanelProps> = ({
  activeExampleId,
  onSelectExample,
}) => {
  const { colors } = useTheme();

  // Find which section activeExampleId belongs to, and expand all by default
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});

  const toggleSection = (id: string) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {EXAMPLE_SECTIONS.map((section) => {
        const isCollapsed = collapsedSections[section.id];
        return (
          <View key={section.id} style={styles.section}>
            <TouchableOpacity
              onPress={() => toggleSection(section.id)}
              style={styles.sectionHeader}
              activeOpacity={0.7}
            >
              <View style={styles.titleRow}>
                <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                  {section.title}
                </Text>
                {section.isExperimental && <ExperimentalBadge size="sm" />}
              </View>
              <Text style={[styles.chevron, { color: colors.textMuted }]}>
                {isCollapsed ? '▸' : '▾'}
              </Text>
            </TouchableOpacity>

            {!isCollapsed && (
              <View style={styles.itemsList}>
                {section.items.map((example) => (
                  <ExampleListItem
                    key={example.id}
                    example={example}
                    isActive={activeExampleId === example.id}
                    onSelect={() => onSelectExample(example)}
                  />
                ))}
              </View>
            )}
          </View>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.xs,
  },
  content: {
    paddingBottom: SPACING.lg,
  },
  section: {
    marginBottom: SPACING.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
    marginBottom: 6,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  chevron: {
    fontSize: 14,
    fontWeight: '600',
  },
  itemsList: {
    gap: 2,
  },
});

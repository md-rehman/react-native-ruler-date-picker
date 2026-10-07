import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ExamplePreset } from '../data/examples';
import { useTheme } from '../context/ThemeContext';
import { RADII, SPACING } from '../theme/tokens';

interface ExampleListItemProps {
  example: ExamplePreset;
  isActive: boolean;
  onSelect: () => void;
}

export const ExampleListItem: React.FC<ExampleListItemProps> = ({
  example,
  isActive,
  onSelect,
}) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      onPress={onSelect}
      activeOpacity={0.7}
      style={[
        styles.card,
        {
          borderColor: isActive ? colors.accent : colors.border,
          backgroundColor: isActive ? colors.activeBg : colors.surface,
        },
      ]}
    >
      <View style={styles.content}>
        <Text style={[styles.name, { color: colors.textPrimary }]}>{example.name}</Text>
        <Text style={[styles.description, { color: colors.textSecondary }]}>
          {example.description}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: SPACING.md - 2,
    borderRadius: RADII.md,
    borderWidth: 1,
    marginBottom: SPACING.xs + 4,
  },
  content: {
    gap: 2,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  description: {
    fontSize: 12,
    lineHeight: 16,
  },
});

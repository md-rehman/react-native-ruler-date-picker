import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { RADII, SPACING } from '../../theme/tokens';

interface EnumSelectProps {
  value: string;
  options: string[];
  onChange: (value: string) => void;
}

export const EnumSelect: React.FC<EnumSelectProps> = ({ value, options, onChange }) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { borderColor: colors.border }]}>
      {options.map((option) => {
        const selected = value === option;
        return (
          <TouchableOpacity
            key={option}
            onPress={() => onChange(option)}
            activeOpacity={0.7}
            style={[
              styles.optionBtn,
              selected && { backgroundColor: colors.accent },
            ]}
          >
            <Text
              style={[
                styles.optionText,
                { color: selected ? '#FFFFFF' : colors.textSecondary },
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: RADII.md,
    padding: 2,
    gap: 2,
  },
  optionBtn: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADII.sm,
  },
  optionText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
});

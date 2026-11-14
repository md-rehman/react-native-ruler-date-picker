import React from 'react';
import { StyleSheet, View, Text, TextInput, Platform } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { RADII } from '../../theme/tokens';

interface OffsetInputProps {
  value: [number, number] | any;
  onChange: (value: [number, number]) => void;
}

export const OffsetInput: React.FC<OffsetInputProps> = ({ value, onChange }) => {
  const { colors } = useTheme();
  const currentVal: [number, number] =
    Array.isArray(value) && value.length === 2 ? [Number(value[0]) || 0, Number(value[1]) || 0] : [0, 0];

  const handleXChange = (text: string) => {
    const parsed = parseInt(text, 10);
    onChange([isNaN(parsed) ? 0 : parsed, currentVal[1]]);
  };

  const handleYChange = (text: string) => {
    const parsed = parseInt(text, 10);
    onChange([currentVal[0], isNaN(parsed) ? 0 : parsed]);
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.axisLabel, { color: colors.textMuted }]}>X</Text>
      <TextInput
        style={[
          styles.input,
          {
            color: colors.textPrimary,
            borderColor: colors.border,
            backgroundColor: colors.surface,
          },
        ]}
        value={String(currentVal[0])}
        onChangeText={handleXChange}
        keyboardType="numeric"
        selectTextOnFocus
      />
      <Text style={[styles.axisLabel, { color: colors.textMuted }]}>Y</Text>
      <TextInput
        style={[
          styles.input,
          {
            color: colors.textPrimary,
            borderColor: colors.border,
            backgroundColor: colors.surface,
          },
        ]}
        value={String(currentVal[1])}
        onChangeText={handleYChange}
        keyboardType="numeric"
        selectTextOnFocus
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  axisLabel: {
    fontSize: 11,
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  input: {
    width: 44,
    height: 30,
    borderWidth: 1,
    borderRadius: RADII.sm + 2,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    paddingVertical: 0,
    paddingHorizontal: 4,
  },
});


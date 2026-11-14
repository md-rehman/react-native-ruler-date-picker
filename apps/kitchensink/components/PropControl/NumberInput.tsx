import React from 'react';
import { StyleSheet, TextInput, Platform } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { RADII } from '../../theme/tokens';

interface NumberInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

export const NumberInput: React.FC<NumberInputProps> = ({
  value,
  onChange,
  min = 0,
  max = 999,
}) => {
  const { colors } = useTheme();

  const handleTextChange = (text: string) => {
    const parsed = parseInt(text, 10);
    if (!isNaN(parsed)) {
      onChange(Math.min(max, Math.max(min, parsed)));
    } else if (text === '') {
      onChange(min);
    }
  };

  return (
    <TextInput
      style={[
        styles.input,
        {
          color: colors.textPrimary,
          borderColor: colors.border,
          backgroundColor: colors.surface,
        },
      ]}
      value={value !== undefined ? String(value) : ''}
      onChangeText={handleTextChange}
      keyboardType="numeric"
      selectTextOnFocus
    />
  );
};

const styles = StyleSheet.create({
  input: {
    width: 110,
    height: 30,
    borderWidth: 1,
    borderRadius: RADII.sm + 2,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    paddingVertical: 0,
    paddingHorizontal: 8,
  },
});


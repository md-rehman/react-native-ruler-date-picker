import React from 'react';
import { StyleSheet, TextInput, View, TouchableOpacity, Text } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { RADII, SPACING } from '../../theme/tokens';

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
  step = 1,
}) => {
  const { colors } = useTheme();

  const handleDecrement = () => {
    const next = Math.max(min, (value || 0) - step);
    onChange(next);
  };

  const handleIncrement = () => {
    const next = Math.min(max, (value || 0) + step);
    onChange(next);
  };

  const handleTextChange = (text: string) => {
    const parsed = parseInt(text, 10);
    if (!isNaN(parsed)) {
      onChange(Math.min(max, Math.max(min, parsed)));
    } else if (text === '') {
      onChange(min);
    }
  };

  return (
    <View style={[styles.container, { borderColor: colors.border }]}>
      <TouchableOpacity onPress={handleDecrement} style={styles.stepBtn}>
        <Text style={[styles.stepText, { color: colors.textPrimary }]}>-</Text>
      </TouchableOpacity>
      <TextInput
        style={[styles.input, { color: colors.textPrimary }]}
        value={String(value ?? '')}
        onChangeText={handleTextChange}
        keyboardType="numeric"
        selectTextOnFocus
      />
      <TouchableOpacity onPress={handleIncrement} style={styles.stepBtn}>
        <Text style={[styles.stepText, { color: colors.textPrimary }]}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: RADII.md,
    overflow: 'hidden',
    height: 32,
  },
  stepBtn: {
    width: 28,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  stepText: {
    fontSize: 16,
    fontWeight: '600',
  },
  input: {
    width: 44,
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
    paddingVertical: 0,
  },
});

import React from 'react';
import { StyleSheet, View, Text, TextInput } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { RADII, SPACING } from '../../theme/tokens';

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
      <View style={[styles.inputBox, { borderColor: colors.border }]}>
        <Text style={[styles.axisLabel, { color: colors.textMuted }]}>X</Text>
        <TextInput
          style={[styles.input, { color: colors.textPrimary }]}
          value={String(currentVal[0])}
          onChangeText={handleXChange}
          keyboardType="numeric"
          selectTextOnFocus
        />
      </View>
      <View style={[styles.inputBox, { borderColor: colors.border }]}>
        <Text style={[styles.axisLabel, { color: colors.textMuted }]}>Y</Text>
        <TextInput
          style={[styles.input, { color: colors.textPrimary }]}
          value={String(currentVal[1])}
          onChangeText={handleYChange}
          keyboardType="numeric"
          selectTextOnFocus
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: RADII.md,
    height: 32,
    paddingHorizontal: 6,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  axisLabel: {
    fontSize: 11,
    fontWeight: '700',
    marginRight: 4,
  },
  input: {
    width: 32,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    paddingVertical: 0,
  },
});

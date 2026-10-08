import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { ResetIcon } from './ModalToggle';
import { RADII, SPACING } from '../theme/tokens';

export const GlassControls: React.FC = () => {
  const { colors, glassAlpha, glassBlur, setGlassAlpha, setGlassBlur, resetGlass } = useTheme();

  const alphaPercent = Math.round(glassAlpha * 100);

  const handleAlphaTap = () => {
    setGlassAlpha((prev) => {
      let nextPercent = Math.round(prev * 100) + 5;
      if (nextPercent > 100) nextPercent = 0;
      return nextPercent / 100;
    });
  };

  const handleBlurTap = () => {
    setGlassBlur((prev) => {
      let next = prev + 1;
      if (next > 20) next = 0;
      return next;
    });
  };

  return (
    <View
      style={[
        styles.container,
        { borderColor: colors.glassBorderColor, backgroundColor: colors.surface },
      ]}
    >
      <TouchableOpacity onPress={handleAlphaTap} style={styles.btn}>
        <Text style={[styles.text, { color: colors.textPrimary }]}>{alphaPercent}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleBlurTap} style={styles.btn}>
        <Text style={[styles.text, { color: colors.textPrimary }]}>{glassBlur}</Text>
      </TouchableOpacity>
      <View style={[styles.divider, { backgroundColor: colors.border }]} />
      <TouchableOpacity onPress={resetGlass} style={styles.btn}>
        <ResetIcon color={colors.textSecondary} />
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
    padding: 2,
    gap: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  btn: {
    paddingHorizontal: SPACING.xs + 3,
    paddingVertical: SPACING.xs + 1,
    borderRadius: RADII.sm,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 28,
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
  divider: {
    width: 1,
    height: 14,
    marginHorizontal: 2,
  },
});

import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Path, Circle, Line } from 'react-native-svg';
import { useTheme } from '../context/ThemeContext';
import { RADII, SPACING } from '../theme/tokens';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme, colors } = useTheme();

  return (
    <TouchableOpacity
      onPress={toggleTheme}
      activeOpacity={0.7}
      style={[styles.btn, { borderColor: colors.glassBorderColor }]}
    >
      {theme === 'light' ? (
        <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <Path
            d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
            stroke={colors.textPrimary}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      ) : (
        <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <Circle cx="12" cy="12" r="5" stroke={colors.textPrimary} strokeWidth="2" />
          <Line x1="12" y1="1" x2="12" y2="3" stroke={colors.textPrimary} strokeWidth="2" strokeLinecap="round" />
          <Line x1="12" y1="21" x2="12" y2="23" stroke={colors.textPrimary} strokeWidth="2" strokeLinecap="round" />
          <Line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke={colors.textPrimary} strokeWidth="2" strokeLinecap="round" />
          <Line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke={colors.textPrimary} strokeWidth="2" strokeLinecap="round" />
          <Line x1="1" y1="12" x2="3" y2="12" stroke={colors.textPrimary} strokeWidth="2" strokeLinecap="round" />
          <Line x1="21" y1="12" x2="23" y2="12" stroke={colors.textPrimary} strokeWidth="2" strokeLinecap="round" />
          <Line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke={colors.textPrimary} strokeWidth="2" strokeLinecap="round" />
          <Line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke={colors.textPrimary} strokeWidth="2" strokeLinecap="round" />
        </Svg>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btn: {
    padding: SPACING.sm - 1,
    borderRadius: RADII.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

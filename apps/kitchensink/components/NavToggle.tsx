import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Svg, { Line } from 'react-native-svg';
import { useTheme } from '../context/ThemeContext';
import { RADII, SPACING } from '../theme/tokens';

interface NavToggleProps {
  active: boolean;
  onToggle: () => void;
}

export const NavToggle: React.FC<NavToggleProps> = ({ active, onToggle }) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      onPress={onToggle}
      activeOpacity={0.7}
      style={[
        styles.button,
        {
          borderColor: colors.glassBorderColor,
          backgroundColor: active ? colors.activeBg : 'transparent',
        },
      ]}
    >
      <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <Line
          x1="3"
          y1="6"
          x2="21"
          y2="6"
          stroke={active ? colors.accent : colors.textPrimary}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <Line
          x1="3"
          y1="12"
          x2="21"
          y2="12"
          stroke={active ? colors.accent : colors.textPrimary}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <Line
          x1="3"
          y1="18"
          x2="21"
          y2="18"
          stroke={active ? colors.accent : colors.textPrimary}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </Svg>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: SPACING.sm - 1,
    borderRadius: RADII.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

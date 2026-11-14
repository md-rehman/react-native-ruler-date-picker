import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Line, Path } from 'react-native-svg';
import { useTheme } from '../context/ThemeContext';
import { RADII, SPACING } from '../theme/tokens';

export const FeaturesIcon = ({ color }: { color: string }) => (
  <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <Line x1="4" y1="21" x2="4" y2="14" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Line x1="4" y1="10" x2="4" y2="3" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Line x1="12" y1="21" x2="12" y2="12" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Line x1="12" y1="8" x2="12" y2="3" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Line x1="20" y1="21" x2="20" y2="16" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Line x1="20" y1="12" x2="20" y2="3" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Line x1="1" y1="14" x2="7" y2="14" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Line x1="9" y1="8" x2="15" y2="8" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Line x1="17" y1="16" x2="23" y2="16" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

export const PropsIcon = FeaturesIcon;

export const ResetIcon = ({ color }: { color: string }) => (
  <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M3 3v5h5"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

interface PropsToggleProps {
  active: boolean;
  onToggle: () => void;
}

export const PropsToggle: React.FC<PropsToggleProps> = ({ active, onToggle }) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      onPress={onToggle}
      activeOpacity={0.7}
      style={[
        styles.button,
        {
          borderColor: colors.glassBorderColor,
          backgroundColor: active ? colors.activeBg : colors.surface,
        },
      ]}
    >
      <FeaturesIcon color={active ? colors.accent : colors.textPrimary} />
    </TouchableOpacity>
  );
};

export const ModalToggle = PropsToggle;

const styles = StyleSheet.create({
  button: {
    padding: SPACING.sm + 2,
    borderWidth: 1,
    borderRadius: RADII.md,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
});

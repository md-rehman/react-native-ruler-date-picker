import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Line, Path } from 'react-native-svg';
import { useTheme } from '../context/ThemeContext';

export const FeaturesIcon = ({
  color,
  size = 24,
}: {
  color: string;
  size?: number;
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Line x1="4" y1="21" x2="4" y2="14" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
    <Line x1="4" y1="10" x2="4" y2="3" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
    <Line x1="12" y1="21" x2="12" y2="12" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
    <Line x1="12" y1="8" x2="12" y2="3" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
    <Line x1="20" y1="21" x2="20" y2="16" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
    <Line x1="20" y1="12" x2="20" y2="3" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
    <Line x1="1" y1="14" x2="7" y2="14" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
    <Line x1="9" y1="8" x2="15" y2="8" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
    <Line x1="17" y1="16" x2="23" y2="16" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
  </Svg>
);

export const PropsIcon = FeaturesIcon;

export const ResetIcon = ({ color, size = 16 }: { color: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
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
  size?: number;
}

export const PropsToggle: React.FC<PropsToggleProps> = ({
  active,
  onToggle,
  size = 56,
}) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      onPress={onToggle}
      activeOpacity={0.75}
      style={[
        styles.button,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderColor: active ? colors.accent : colors.glassBorderColor,
          backgroundColor: active ? colors.activeBg : colors.surface,
        },
      ]}
    >
      <FeaturesIcon
        color={active ? colors.accent : colors.textPrimary}
        size={Math.round(size * 0.44)}
      />
    </TouchableOpacity>
  );
};

export const ModalToggle = PropsToggle;

const styles = StyleSheet.create({
  button: {
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
});

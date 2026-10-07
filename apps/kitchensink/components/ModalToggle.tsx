import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import Svg, { Path, Circle, Line } from 'react-native-svg';
import { useTheme } from '../context/ThemeContext';
import { Category } from '../data/propDefinitions';
import { RADII, SPACING } from '../theme/tokens';

interface ModalToggleProps {
  visibleModals: Record<Category, boolean>;
  onToggle: (category: Category) => void;
  onReset: () => void;
}

export const SelectionIcon = ({ color }: { color: string }) => (
  <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M13 13l6 6"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const DimensionsIcon = ({ color }: { color: string }) => (
  <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <Path
      d="m21 21-6-6m6 6v-4.8m0 4.8h-4.8"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M3 16.2V21m0 0h4.8M3 21l6-6"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M21 7.8V3m0 0h-4.8M21 3l-6 6"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M3 7.8V3m0 0h4.8M3 3l6 6"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const ColorsIcon = ({ color }: { color: string }) => (
  <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <Circle cx="13.5" cy="6.5" r="1" fill={color} />
    <Circle cx="17.5" cy="10.5" r="1" fill={color} />
    <Circle cx="8.5" cy="7.5" r="1" fill={color} />
    <Circle cx="6.5" cy="12.5" r="1" fill={color} />
    <Path
      d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"
      stroke={color}
      strokeWidth="2"
    />
  </Svg>
);

export const FeaturesIcon = ({ color }: { color: string }) => (
  <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
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

export const ModalToggle: React.FC<ModalToggleProps> = ({
  visibleModals,
  onToggle,
  onReset,
}) => {
  const { colors } = useTheme();

  const categories: { key: Category; renderIcon: (c: string) => React.ReactNode }[] = [
    { key: 'Selection', renderIcon: (c) => <SelectionIcon color={c} /> },
    { key: 'Dimensions', renderIcon: (c) => <DimensionsIcon color={c} /> },
    { key: 'Colors', renderIcon: (c) => <ColorsIcon color={c} /> },
    { key: 'Features', renderIcon: (c) => <FeaturesIcon color={c} /> },
  ];

  return (
    <View style={[styles.container, { borderColor: colors.glassBorderColor }]}>
      {categories.map(({ key, renderIcon }) => {
        const isActive = visibleModals[key];
        const iconColor = isActive ? colors.accent : colors.textSecondary;
        return (
          <TouchableOpacity
            key={key}
            onPress={() => onToggle(key)}
            style={[
              styles.btn,
              isActive && { backgroundColor: colors.activeBg },
            ]}
          >
            {renderIcon(iconColor)}
          </TouchableOpacity>
        );
      })}
      <View style={[styles.divider, { backgroundColor: colors.border }]} />
      <TouchableOpacity onPress={onReset} style={styles.btn}>
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
  },
  btn: {
    padding: SPACING.xs + 2,
    borderRadius: RADII.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    width: 1,
    height: 14,
    marginHorizontal: 2,
  },
});

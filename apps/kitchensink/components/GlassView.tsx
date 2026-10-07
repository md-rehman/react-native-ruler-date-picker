import React, { ReactNode } from 'react';
import { StyleSheet, View, ViewStyle, StyleProp } from 'react-native';
import { BlurView } from 'expo-blur';
import { useTheme } from '../context/ThemeContext';
import { RADII } from '../theme/tokens';

interface GlassViewProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  borderRadius?: number;
}

export const GlassView: React.FC<GlassViewProps> = ({
  children,
  style,
  borderRadius = RADII.lg,
}) => {
  const { theme, colors, glassAlpha, glassBlur } = useTheme();

  // Map glassBlur (0 to 20) to BlurView intensity (0 to 100)
  const blurIntensity = Math.min(100, Math.max(0, glassBlur * 5));

  // Construct rgba background using theme glassBgRgb & glassAlpha
  const glassBgColor = `rgba(${colors.glassBgRgb}, ${glassAlpha})`;

  return (
    <View
      style={[
        styles.container,
        {
          borderRadius,
          borderColor: colors.glassBorderColor,
        },
        style,
      ]}
    >
      <BlurView
        tint={theme === 'dark' ? 'dark' : 'light'}
        intensity={blurIntensity}
        style={StyleSheet.absoluteFill}
      />
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: glassBgColor,
            borderRadius,
          },
        ]}
      />
      <View style={{ flex: 1 }}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
});

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
  type TextStyle,
} from 'react-native';
import { useRulerContext } from './RulerContext';

export interface RulerResetButtonProps {
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  label?: string;
}

export function RulerResetButton({
  style,
  textStyle,
  label = 'Today',
}: RulerResetButtonProps = {}) {
  const { resetToToday, theme } = useRulerContext();

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => resetToToday(true)}
      style={[styles.resetBtn, style]}
    >
      <Text
        style={[
          styles.resetText,
          { color: theme.accentColor },
          textStyle,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  resetBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  resetText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

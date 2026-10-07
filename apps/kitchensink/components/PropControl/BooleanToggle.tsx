import React from 'react';
import { Switch, View, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

interface BooleanToggleProps {
  value: boolean;
  onChange: (value: boolean) => void;
}

export const BooleanToggle: React.FC<BooleanToggleProps> = ({ value, onChange }) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Switch
        value={!!value}
        onValueChange={onChange}
        trackColor={{ false: colors.border, true: colors.accent }}
        thumbColor="#FFFFFF"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-end',
  },
});

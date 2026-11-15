import React from 'react';
import { StyleSheet, View } from 'react-native';
import { NavToggle } from './NavToggle';
import { ThemeToggle } from './ThemeToggle';
import { SPACING } from '../theme/tokens';

interface TopBarProps {
  showExamples: boolean;
  onToggleExamples: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  showExamples,
  onToggleExamples,
}) => {
  return (
    <View style={styles.fixedWrapper} pointerEvents="box-none">
      <View style={styles.leftSection} pointerEvents="box-none">
        <NavToggle active={showExamples} onToggle={onToggleExamples} />
      </View>
      <View style={styles.rightSection} pointerEvents="box-none">
        <ThemeToggle />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  fixedWrapper: {
    position: 'absolute',
    top: SPACING.sm,
    left: SPACING.md,
    right: SPACING.md,
    zIndex: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  rightSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
});

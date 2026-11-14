import React from 'react';
import { StyleSheet, View } from 'react-native';
import { NavToggle } from './NavToggle';
import { PropsToggle } from './ModalToggle';
import { ThemeToggle } from './ThemeToggle';
import { SPACING } from '../theme/tokens';

interface TopBarProps {
  showExamples: boolean;
  onToggleExamples: () => void;
  showProps: boolean;
  onToggleProps: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  showExamples,
  onToggleExamples,
  showProps,
  onToggleProps,
}) => {
  return (
    <View style={styles.fixedWrapper} pointerEvents="box-none">
      <View style={styles.leftSection} pointerEvents="box-none">
        <NavToggle active={showExamples} onToggle={onToggleExamples} />
      </View>
      <View style={styles.centerSection} pointerEvents="box-none">
        <PropsToggle active={showProps} onToggle={onToggleProps} />
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
  centerSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
});

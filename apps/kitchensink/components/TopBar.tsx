import React from 'react';
import { StyleSheet, View } from 'react-native';
import { NavToggle } from './NavToggle';
import { ModalToggle } from './ModalToggle';
import { ThemeToggle } from './ThemeToggle';
import { Category } from '../data/propDefinitions';
import { SPACING } from '../theme/tokens';

interface TopBarProps {
  showExamples: boolean;
  onToggleExamples: () => void;
  visibleModals: Record<Category, boolean>;
  onToggleModal: (category: Category) => void;
  onResetModals: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  showExamples,
  onToggleExamples,
  visibleModals,
  onToggleModal,
  onResetModals,
}) => {
  return (
    <View style={styles.fixedWrapper} pointerEvents="box-none">
      <View style={styles.leftSection} pointerEvents="box-none">
        <NavToggle active={showExamples} onToggle={onToggleExamples} />
      </View>
      <View style={styles.centerSection} pointerEvents="box-none">
        <ModalToggle
          visibleModals={visibleModals}
          onToggle={onToggleModal}
          onReset={onResetModals}
        />
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

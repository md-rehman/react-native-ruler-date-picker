import React from 'react';
import { StyleSheet, View } from 'react-native';
import { NavToggle } from './NavToggle';
import { GlassControls } from './GlassControls';
import { ModalToggle } from './ModalToggle';
import { ThemeToggle } from './ThemeToggle';
import { GlassView } from './GlassView';
import { Category } from '../data/propDefinitions';
import { TOPBAR_HEIGHT, SPACING } from '../theme/tokens';

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
      <GlassView borderRadius={0} style={styles.glassBar}>
        <View style={styles.innerBar}>
          <View style={styles.leftSection}>
            <NavToggle active={showExamples} onToggle={onToggleExamples} />
          </View>
          <View style={styles.rightSection}>
            <GlassControls />
            <ModalToggle
              visibleModals={visibleModals}
              onToggle={onToggleModal}
              onReset={onResetModals}
            />
            <ThemeToggle />
          </View>
        </View>
      </GlassView>
    </View>
  );
};

const styles = StyleSheet.create({
  fixedWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  glassBar: {
    height: TOPBAR_HEIGHT + 10,
    borderBottomWidth: 1,
  },
  innerBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.sm + 4,
    paddingTop: SPACING.xs,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs + 2,
  },
});

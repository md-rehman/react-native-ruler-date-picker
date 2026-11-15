import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { usePickerProps } from '../hooks/usePickerProps';
import { ComponentPreview } from './ComponentPreview';
import { TopBar } from './TopBar';
import { FloatingModal } from './FloatingModal';
import { ExamplesPanel } from './ExamplesPanel';
import { PropsPanel } from './PropsPanel';
import { GlassControls } from './GlassControls';
import { PropsToggle, FeaturesIcon } from './ModalToggle';
import { SPACING } from '../theme/tokens';

export const AppShell: React.FC = () => {
  const { colors } = useTheme();
  const {
    componentType,
    props: pickerProps,
    activeExampleId,
    loadPreset,
    updateProp,
  } = usePickerProps();

  const [showExamples, setShowExamples] = useState(false);
  const [showProps, setShowProps] = useState(false);

  const handleToggleExamples = () => {
    setShowExamples((prev) => !prev);
  };

  const handleToggleProps = () => {
    setShowProps((prev) => !prev);
  };

  return (
    <View style={styles.container}>
      {/* Main centered component preview */}
      <ComponentPreview
        pickerProps={pickerProps}
        componentType={componentType}
        updateProp={updateProp}
      />

      {/* Examples Modal (Full screen, GlassControls in header, tap outside to close) */}
      <FloatingModal
        id="examples"
        title="Examples"
        fullScreen
        onClose={() => setShowExamples(false)}
        headerRight={<GlassControls />}
        visible={showExamples}
      >
        <ExamplesPanel
          activeExampleId={activeExampleId}
          onSelectExample={loadPreset}
        />
      </FloatingModal>

      {/* Unified Props Modal (Matches Playground, larger, animated from bottom FAB) */}
      <FloatingModal
        id="props"
        title="PROPS"
        icon={<FeaturesIcon color={colors.textMuted} size={16} />}
        animateFromBottom
        visible={showProps}
        onClose={() => setShowProps(false)}
      >
        <PropsPanel
          pickerProps={pickerProps}
          componentType={componentType}
          updateProp={updateProp}
        />
      </FloatingModal>

      {/* Floating Header Controls */}
      <TopBar
        showExamples={showExamples}
        onToggleExamples={handleToggleExamples}
      />

      {/* Floating Bottom Action Button (Round & Larger, positioned lower) */}
      <View style={styles.bottomBar} pointerEvents="box-none">
        <PropsToggle active={showProps} onToggle={handleToggleProps} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 90,
  },
});

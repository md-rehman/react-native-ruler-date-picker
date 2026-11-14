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
import { FeaturesIcon } from './ModalToggle';

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

      {/* Unified Props Modal (Matches Playground) */}
      <FloatingModal
        id="props"
        title="PROPS"
        icon={<FeaturesIcon color={colors.textMuted} />}
        defaultDocked="none"
        defaultPosition={{ x: 20, y: 70 }}
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
        showProps={showProps}
        onToggleProps={handleToggleProps}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

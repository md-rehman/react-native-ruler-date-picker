import React, { useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../context/ThemeContext';
import { usePickerProps } from '../hooks/usePickerProps';
import { PROP_DEFINITIONS, Category } from '../data/propDefinitions';
import { GridBackground } from './GridBackground';
import { ComponentPreview } from './ComponentPreview';
import { TopBar } from './TopBar';
import { FloatingModal } from './FloatingModal';
import { ExamplesPanel } from './ExamplesPanel';
import { PropControl } from './PropControl/PropControl';
import {
  SelectionIcon,
  DimensionsIcon,
  ColorsIcon,
  FeaturesIcon,
} from './ModalToggle';

export const AppShell: React.FC = () => {
  const { colors } = useTheme();
  const { props: pickerProps, activeExampleId, loadPreset, updateProp } = usePickerProps();

  const [showExamples, setShowExamples] = useState(true);
  const [visibleModals, setVisibleModals] = useState<Record<Category, boolean>>({
    Selection: true,
    Dimensions: false,
    Colors: false,
    Features: false,
  });

  const handleToggleExamples = () => {
    setShowExamples((prev) => !prev);
  };

  const handleToggleModal = (category: Category) => {
    setVisibleModals((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const handleResetModals = () => {
    // Clear modal positions in AsyncStorage
    const modalIds = ['examples', 'selection', 'dimensions', 'colors', 'features'];
    modalIds.forEach((id) => AsyncStorage.removeItem(`modal-${id}`));

    setShowExamples(true);
    setVisibleModals({
      Selection: true,
      Dimensions: false,
      Colors: false,
      Features: false,
    });
  };

  const renderCategoryContent = (category: Category) => {
    const definitions = PROP_DEFINITIONS.filter((p) => p.category === category);
    return (
      <ScrollView contentContainerStyle={styles.propScrollContent}>
        {definitions.map((def) => (
          <PropControl
            key={def.name}
            definition={def}
            value={pickerProps[def.name]}
            onChange={(val) => updateProp(def.name, val)}
          />
        ))}
      </ScrollView>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      {/* Subtle grid background pattern */}
      <GridBackground />

      {/* Main centered component preview */}
      <ComponentPreview pickerProps={pickerProps} />

      {/* Examples Modal (Docked Left) */}
      <FloatingModal
        id="examples"
        title="Examples"
        defaultDocked="left"
        defaultPosition={{ x: 20, y: 80 }}
        visible={showExamples}
      >
        <ExamplesPanel
          activeExampleId={activeExampleId}
          onSelectExample={loadPreset}
        />
      </FloatingModal>

      {/* Selection Settings Modal */}
      <FloatingModal
        id="selection"
        title="Selection"
        icon={<SelectionIcon color={colors.accent} />}
        defaultDocked="right"
        defaultPosition={{ x: 240, y: 80 }}
        visible={visibleModals.Selection}
      >
        {renderCategoryContent('Selection')}
      </FloatingModal>

      {/* Dimensions Settings Modal */}
      <FloatingModal
        id="dimensions"
        title="Dimensions"
        icon={<DimensionsIcon color={colors.accent} />}
        defaultDocked="right"
        defaultPosition={{ x: 240, y: 140 }}
        visible={visibleModals.Dimensions}
      >
        {renderCategoryContent('Dimensions')}
      </FloatingModal>

      {/* Colors Settings Modal */}
      <FloatingModal
        id="colors"
        title="Colors"
        icon={<ColorsIcon color={colors.accent} />}
        defaultDocked="right"
        defaultPosition={{ x: 240, y: 200 }}
        visible={visibleModals.Colors}
      >
        {renderCategoryContent('Colors')}
      </FloatingModal>

      {/* Features Settings Modal */}
      <FloatingModal
        id="features"
        title="Features"
        icon={<FeaturesIcon color={colors.accent} />}
        defaultDocked="right"
        defaultPosition={{ x: 240, y: 260 }}
        visible={visibleModals.Features}
      >
        {renderCategoryContent('Features')}
      </FloatingModal>

      {/* Fixed top header bar */}
      <TopBar
        showExamples={showExamples}
        onToggleExamples={handleToggleExamples}
        visibleModals={visibleModals}
        onToggleModal={handleToggleModal}
        onResetModals={handleResetModals}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  propScrollContent: {
    paddingVertical: 4,
  },
});

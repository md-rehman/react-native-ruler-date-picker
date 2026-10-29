import React, { useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../context/ThemeContext';
import { usePickerProps } from '../hooks/usePickerProps';
import { PROP_DEFINITIONS, Category, getPropGroupsForComponent } from '../data/propDefinitions';
import { ComponentPreview } from './ComponentPreview';
import { TopBar } from './TopBar';
import { FloatingModal } from './FloatingModal';
import { ExamplesPanel } from './ExamplesPanel';
import { GlassControls } from './GlassControls';
import { PropControl } from './PropControl/PropControl';
import {
  SelectionIcon,
  DimensionsIcon,
  ColorsIcon,
  FeaturesIcon,
} from './ModalToggle';

function getPropValue(props: Record<string, any>, name: string) {
  if (name.includes('.')) {
    const [parent, child] = name.split('.');
    return props[parent]?.[child];
  }
  return props[name];
}

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
  const [visibleModals, setVisibleModals] = useState<Record<Category, boolean>>({
    Selection: false,
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

    setShowExamples(false);
    setVisibleModals({
      Selection: false,
      Dimensions: false,
      Colors: false,
      Features: false,
    });
  };

  const renderCategoryContent = (category: Category) => {
    const propGroups = getPropGroupsForComponent(componentType);
    const allowedPropNames = new Set(propGroups.flatMap((g) => g.propNames));

    const definitions = PROP_DEFINITIONS.filter(
      (p) => p.category === category && allowedPropNames.has(p.name)
    );

    return (
      <ScrollView contentContainerStyle={styles.propScrollContent}>
        {definitions.map((def) => (
          <PropControl
            key={def.name}
            definition={def}
            value={getPropValue(pickerProps, def.name)}
            onChange={(val) => updateProp(def.name, val)}
          />
        ))}
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      {/* Main centered component preview */}
      <ComponentPreview
        pickerProps={pickerProps}
        componentType={componentType}
        updateProp={updateProp}
      />

      {/* Examples Modal (Floating, default open state, GlassControls in header) */}
      <FloatingModal
        id="examples"
        title="Presets"
        defaultDocked="none"
        defaultPosition={{ x: 20, y: 70 }}
        headerRight={<GlassControls />}
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
        defaultDocked="none"
        defaultPosition={{ x: 40, y: 90 }}
        visible={visibleModals.Selection}
      >
        {renderCategoryContent('Selection')}
      </FloatingModal>

      {/* Dimensions Settings Modal */}
      <FloatingModal
        id="dimensions"
        title="Dimensions"
        icon={<DimensionsIcon color={colors.accent} />}
        defaultDocked="none"
        defaultPosition={{ x: 50, y: 130 }}
        visible={visibleModals.Dimensions}
      >
        {renderCategoryContent('Dimensions')}
      </FloatingModal>

      {/* Colors Settings Modal */}
      <FloatingModal
        id="colors"
        title="Colors"
        icon={<ColorsIcon color={colors.accent} />}
        defaultDocked="none"
        defaultPosition={{ x: 60, y: 170 }}
        visible={visibleModals.Colors}
      >
        {renderCategoryContent('Colors')}
      </FloatingModal>

      {/* Features Settings Modal */}
      <FloatingModal
        id="features"
        title="Features"
        icon={<FeaturesIcon color={colors.accent} />}
        defaultDocked="none"
        defaultPosition={{ x: 70, y: 210 }}
        visible={visibleModals.Features}
      >
        {renderCategoryContent('Features')}
      </FloatingModal>

      {/* Floating Header Controls */}
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

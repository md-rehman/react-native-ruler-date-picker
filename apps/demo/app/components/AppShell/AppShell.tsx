"use client";

import React, { useState, useEffect } from 'react';
import TopBar from '../TopBar/TopBar';
import CentralView from '../CentralView/CentralView';
import FloatingModal from '../FloatingModal/FloatingModal';
import ExamplesPanel from '../ExamplesPanel/ExamplesPanel';
import PropControl from '../PropControl/PropControl';
import CodeModal from '../CodeModal/CodeModal';
import { DeviceType } from '../DeviceSelector/DeviceSelector';
import { usePickerProps } from '../../../hooks/usePickerProps';
import { PROP_DEFINITIONS } from '../../../data/propDefinitions';
import { SelectionIcon, DimensionsIcon, ColorsIcon, FeaturesIcon } from '../ModalToggle/ModalToggle';
import styles from './AppShell.module.css';

export default function AppShell() {
  const [activeDevice, setActiveDevice] = useState<DeviceType>('iphone');
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
  const [codeModalPresetId, setCodeModalPresetId] = useState<string>('default');
  const pickerState = usePickerProps();

  const handleOpenCodeModal = (presetId?: string) => {
    setCodeModalPresetId(presetId || pickerState.activeExampleId || 'default');
    setIsCodeModalOpen(true);
  };

  const categories = ['Selection', 'Dimensions', 'Colors', 'Features'] as const;
  type Category = typeof categories[number];
  
  const [visibleModals, setVisibleModals] = useState<Record<Category, boolean>>({
    Selection: true,
    Dimensions: true,
    Colors: true,
    Features: true
  });

  const toggleModal = (category: Category) => {
    setVisibleModals(prev => ({ ...prev, [category]: !prev[category] }));
  };

  const handleResetModals = () => {
    setVisibleModals({
      Selection: true,
      Dimensions: true,
      Colors: true,
      Features: true
    });
    window.dispatchEvent(new Event('resetModals'));
  };

  return (
    <div className={styles.shell}>
      <TopBar 
        activeDevice={activeDevice} 
        onDeviceChange={setActiveDevice}
        visibleModals={visibleModals}
        onToggleModal={toggleModal}
        onResetModals={handleResetModals}
        onOpenCodeModal={() => handleOpenCodeModal()}
      />
      
      <div className={styles.main}>
        <CentralView 
          activeDevice={activeDevice}
          pickerProps={pickerState.props}
          updateProp={pickerState.updateProp}
        />
        
        <FloatingModal
          id="examples"
          title="Examples"
          defaultPosition={() => ({ x: 24, y: 80 })}
          defaultDocked={typeof window !== 'undefined' && window.innerWidth < 1024 ? 'left' : 'none'}
        >
          <ExamplesPanel 
            activeExampleId={pickerState.activeExampleId}
            onSelectExample={pickerState.loadPreset}
            onOpenCodeModal={(presetId) => handleOpenCodeModal(presetId)}
          />
        </FloatingModal>

        {categories.map((category) => {
          if (!visibleModals[category]) return null;
          
          const categoryProps = PROP_DEFINITIONS.filter(p => p.category === category);
          
          let IconComponent = null;
          if (category === 'Selection') IconComponent = <SelectionIcon />;
          else if (category === 'Dimensions') IconComponent = <DimensionsIcon />;
          else if (category === 'Colors') IconComponent = <ColorsIcon />;
          else if (category === 'Features') IconComponent = <FeaturesIcon />;
          
          return (
            <FloatingModal
              key={category}
              id={category.toLowerCase()}
              title={category}
              icon={IconComponent}
              defaultPosition={() => {
                const w = window.innerWidth;
                const h = window.innerHeight;
                
                // Approximate heights of modals
                const selectionH = 200;
                const dimensionsH = 410;
                const colorsH = 480;
                const featuresH = 200;
                const gap = 24;
                const marginY = 80; // 56px TopBar + 24px margin
                
                const col1X = w - 344; // 320 width + 24 margin
                const col2X = w - 688; // 344 + 320 width + 24 gap

                switch (category) {
                  case 'Selection': 
                    return { x: col1X, y: marginY };
                  case 'Dimensions': 
                    return { x: col1X, y: marginY + selectionH + gap };
                  case 'Colors': 
                    return { x: col1X, y: marginY + selectionH + gap + dimensionsH + gap };
                  case 'Features': {
                     const totalH = marginY + selectionH + gap + dimensionsH + gap + colorsH + gap + featuresH;
                     if (totalH > h) {
                       return { x: col2X, y: marginY };
                     } else {
                       return { x: col1X, y: marginY + selectionH + gap + dimensionsH + gap + colorsH + gap };
                     }
                  }
                  default: return { x: col1X, y: marginY };
                }
              }}
              defaultDocked={typeof window !== 'undefined' && window.innerWidth < 1024 ? 'right' : 'none'}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                {categoryProps.map(prop => (
                  <PropControl
                    key={prop.name}
                    definition={prop}
                    value={pickerState.props[prop.name]}
                    onChange={(val) => pickerState.updateProp(prop.name, val)}
                  />
                ))}
              </div>
            </FloatingModal>
          );
        })}
      </div>

      <CodeModal
        isOpen={isCodeModalOpen}
        onClose={() => setIsCodeModalOpen(false)}
        activePresetId={codeModalPresetId}
        currentProps={pickerState.props}
      />
    </div>
  );
}


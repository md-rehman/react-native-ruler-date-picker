"use client";

import React, { useState, useEffect } from 'react';
import TopBar from '../TopBar/TopBar';
import CentralView from '../CentralView/CentralView';
import FloatingModal from '../FloatingModal/FloatingModal';
import ExamplesPanel from '../ExamplesPanel/ExamplesPanel';
import PropControl from '../PropControl/PropControl';
import { DeviceType } from '../DeviceSelector/DeviceSelector';
import { usePickerProps } from '../../../hooks/usePickerProps';
import { PROP_DEFINITIONS } from '../../../data/propDefinitions';
import styles from './AppShell.module.css';

export default function AppShell() {
  const [activeDevice, setActiveDevice] = useState<DeviceType>('iphone');
  const pickerState = usePickerProps();

  const categories = ['Selection', 'Dimensions', 'Colors', 'Features'] as const;

  return (
    <div className={styles.shell}>
      <TopBar 
        activeDevice={activeDevice} 
        onDeviceChange={setActiveDevice}
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
          defaultPosition={() => ({ x: 20, y: 60 })}
          defaultDocked={typeof window !== 'undefined' && window.innerWidth < 1024 ? 'left' : 'none'}
        >
          <ExamplesPanel 
            activeExampleId={pickerState.activeExampleId}
            onSelectExample={pickerState.loadPreset}
          />
        </FloatingModal>

        {categories.map((category) => {
          const categoryProps = PROP_DEFINITIONS.filter(p => p.category === category);
          
          return (
            <FloatingModal
              key={category}
              id={category.toLowerCase()}
              title={category}
              defaultPosition={() => {
                const w = window.innerWidth;
                switch (category) {
                  case 'Features': return { x: w - 680, y: 60 };
                  case 'Selection': return { x: w - 340, y: 60 };
                  case 'Dimensions': return { x: w - 340, y: 220 };
                  case 'Colors': return { x: w - 340, y: 560 };
                  default: return { x: w - 340, y: 120 };
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
    </div>
  );
}


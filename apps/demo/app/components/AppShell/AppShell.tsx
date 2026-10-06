"use client";

import React, { useState, useEffect } from 'react';
import TopBar from '../TopBar/TopBar';
import LeftNav from '../LeftNav/LeftNav';
import RightNav from '../RightNav/RightNav';
import CentralView from '../CentralView/CentralView';
import { DeviceType } from '../DeviceSelector/DeviceSelector';
import { usePickerProps } from '../../../hooks/usePickerProps';
import { PROP_DEFINITIONS } from '../../../data/propDefinitions';
import FloatingModal from '../FloatingModal/FloatingModal';
import styles from './AppShell.module.css';

export default function AppShell() {
  const [activeDevice, setActiveDevice] = useState<DeviceType>('iphone');
  const [leftNavOpen, setLeftNavOpen] = useState(true);
  const [rightNavOpen, setRightNavOpen] = useState(true);
  
  const pickerState = usePickerProps();

  // Auto-collapse on mobile/tablet mount
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setLeftNavOpen(false);
      setRightNavOpen(false);
    }
  }, []);

  return (
    <div className={styles.shell}>
      <TopBar 
        activeDevice={activeDevice} 
        onDeviceChange={setActiveDevice}
        onToggleLeftNav={() => setLeftNavOpen(!leftNavOpen)}
        onToggleRightNav={() => setRightNavOpen(!rightNavOpen)}
      />
      
      <div className={styles.main}>
        <LeftNav 
          isOpen={leftNavOpen} 
          onClose={() => window.innerWidth < 1024 && setLeftNavOpen(false)}
          activeExampleId={pickerState.activeExampleId}
          onSelectExample={pickerState.loadPreset}
        />
        
        <CentralView 
          activeDevice={activeDevice}
          pickerProps={pickerState.props}
          updateProp={pickerState.updateProp}
        />
        
        <RightNav 
          isOpen={rightNavOpen}
          onClose={() => window.innerWidth < 1024 && setRightNavOpen(false)}
          pickerProps={pickerState.props}
          updateProp={pickerState.updateProp}
        />
        
        <FloatingModal
          title="Colors"
          propsList={PROP_DEFINITIONS.filter(p => p.category.toLowerCase() === 'colors')}
          pickerProps={pickerState.props}
          updateProp={pickerState.updateProp}
          defaultPosition={{ x: 100, y: 150 }}
        />
      </div>
      
      {/* Overlay for mobile when nav is open */}
      {(leftNavOpen || rightNavOpen) && (
        <div 
          className={styles.overlay} 
          onClick={() => {
            if (window.innerWidth < 1024) {
              setLeftNavOpen(false);
              setRightNavOpen(false);
            }
          }}
        />
      )}
    </div>
  );
}

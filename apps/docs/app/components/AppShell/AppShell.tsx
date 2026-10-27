"use client";

import React, { useState, useEffect } from 'react';
import TopBar from '../TopBar/TopBar';
import CentralView from '../CentralView/CentralView';
import FloatingModal from '../FloatingModal/FloatingModal';
import ExamplesPanel from '../ExamplesPanel/ExamplesPanel';
import PropsPanel from '../PropsPanel/PropsPanel';
import CodeModal from '../CodeModal/CodeModal';
import LiveCodeEditor from '../LiveCodeEditor/LiveCodeEditor';
import { DeviceType } from '../DeviceSelector/DeviceSelector';
import { usePickerProps } from '../../../hooks/usePickerProps';
import { EXAMPLES } from '../../../data/examples';
import { PropsIcon, CodeIcon, ModalCategory } from '../ModalToggle/ModalToggle';
import styles from './AppShell.module.css';

export default function AppShell() {
  const [activeDevice, setActiveDevice] = useState<DeviceType>('iphone');
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
  const [codeModalPresetId, setCodeModalPresetId] = useState<string>(EXAMPLES[0]?.id || 'sunset-amber');
  const pickerState = usePickerProps();

  const PROPS_PANEL_WIDTH = 360;
  const TOP_MARGIN = 80;
  const SIDE_MARGIN = 24;
  const BOTTOM_MARGIN = 24;

  // 2 modes: Props mode (visual inspector) and Code mode (live editor)
  const [visibleModals, setVisibleModals] = useState<Record<ModalCategory, boolean>>({
    Props: true,
    Code: false,
  });

  // User manually moved positions
  const [manualPositions, setManualPositions] = useState<Partial<Record<ModalCategory, { x: number; y: number }>>>({});

  // Viewport dimensions
  const [windowSize, setWindowSize] = useState<{ width: number; height: number }>({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 900,
  });

  // Position of left modal (Examples)
  const [examplesPos, setExamplesPos] = useState<{ x: number; y: number }>({ x: SIDE_MARGIN, y: TOP_MARGIN });

  // Load manual positions from localStorage on mount
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const loaded: Partial<Record<ModalCategory, { x: number; y: number }>> = {};
    (['Props', 'Code'] as const).forEach((cat) => {
      const stored = localStorage.getItem(`modal-${cat.toLowerCase()}`);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed.isManual && parsed.position) {
            loaded[cat] = parsed.position;
          }
        } catch (e) {}
      }
    });
    setManualPositions(loaded);

    const storedExamples = localStorage.getItem('modal-examples');
    if (storedExamples) {
      try {
        const parsed = JSON.parse(storedExamples);
        if (parsed.position) setExamplesPos(parsed.position);
      } catch (e) {}
    }

    // Check if user redirected from InlinePlayground with custom edited code
    const incomingCode = localStorage.getItem('ruler-playground-incoming-code');
    if (incomingCode) {
      pickerState.updateFromCode(incomingCode);
      setVisibleModals({
        Props: false,
        Code: true,
      });
      localStorage.removeItem('ruler-playground-incoming-code');
    }

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleOpenCodeModal = (presetId?: string) => {
    const id = presetId || pickerState.activeExampleId || EXAMPLES[0]?.id || 'sunset-amber';
    const preset = EXAMPLES.find((e) => e.id === id);
    if (preset) {
      pickerState.loadPreset(preset);
    }
    // Switch to Code mode
    setVisibleModals({
      Props: false,
      Code: true,
    });
  };

  // Toggle mode: click active mode to close, click inactive mode to switch to it
  const toggleModal = (category: ModalCategory) => {
    const isCurrentlyVisible = visibleModals[category];

    if (isCurrentlyVisible) {
      // Toggle off: close both modals for full canvas view
      setVisibleModals({
        Props: false,
        Code: false,
      });
    } else {
      // Switch exclusively to clicked mode
      setVisibleModals({
        Props: category === 'Props',
        Code: category === 'Code',
      });
    }
  };

  // Reset modals & layout: reset to default single modal (Props)
  const handleResetModals = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('modal-props');
      localStorage.removeItem('modal-code');
      localStorage.removeItem('modal-examples');
      // Also clean up any legacy category keys
      ['selection', 'dimensions', 'colors', 'features'].forEach((cat) => {
        localStorage.removeItem(`modal-${cat}`);
      });
    }
    setManualPositions({});
    setExamplesPos({ x: SIDE_MARGIN, y: TOP_MARGIN });

    setVisibleModals({
      Props: true,
      Code: false,
    });

    window.dispatchEvent(new Event('resetModals'));
  };

  const handlePositionChange = React.useCallback(
    (category: ModalCategory, pos: { x: number; y: number }, isManual: boolean) => {
      if (isManual) {
        setManualPositions((prev) => ({
          ...prev,
          [category]: pos,
        }));
      }
    },
    []
  );

  // Left modal metrics: always takes complete height with consistent margins from screen borders
  const leftWidth = 300;
  const leftY = examplesPos.y ?? TOP_MARGIN;
  const leftHeight = Math.max(200, windowSize.height - BOTTOM_MARGIN - leftY);

  return (
    <div className={styles.shell}>
      <TopBar
        activeDevice={activeDevice}
        onDeviceChange={setActiveDevice}
        visibleModals={visibleModals}
        onToggleModal={toggleModal}
        onResetModals={handleResetModals}
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
          width={leftWidth}
          height={leftHeight}
          defaultPosition={() => ({ x: SIDE_MARGIN, y: TOP_MARGIN })}
          onPositionChange={(pos) => setExamplesPos(pos)}
          defaultDocked={typeof window !== 'undefined' && window.innerWidth < 1024 ? 'left' : 'none'}
        >
          <ExamplesPanel
            activeExampleId={pickerState.activeExampleId}
            onSelectExample={pickerState.loadPreset}
            onOpenCodeModal={(presetId) => handleOpenCodeModal(presetId)}
          />
        </FloatingModal>

        {visibleModals['Props'] && (() => {
          const propsWidth = Math.min(PROPS_PANEL_WIDTH, windowSize.width - 32);
          const defaultPropsX = Math.max(16, windowSize.width - propsWidth - SIDE_MARGIN);
          const currentPos = manualPositions['Props'] ?? { x: defaultPropsX, y: TOP_MARGIN };

          // Takes complete available height with consistent margin from bottom screen border
          const targetHeight = Math.max(200, windowSize.height - BOTTOM_MARGIN - currentPos.y);

          return (
            <FloatingModal
              id="props"
              title="Props"
              icon={<PropsIcon />}
              width={propsWidth}
              height={targetHeight}
              position={currentPos}
              onPositionChange={(pos, isManual) => handlePositionChange('Props', pos, isManual)}
              onClose={() => toggleModal('Props')}
              defaultDocked={typeof window !== 'undefined' && window.innerWidth < 1024 ? 'right' : 'none'}
            >
              <PropsPanel
                pickerProps={pickerState.props}
                updateProp={pickerState.updateProp}
              />
            </FloatingModal>
          );
        })()}

        {visibleModals['Code'] && (() => {
          const codeWidth = Math.min(540, windowSize.width - 32);
          const defaultCodeX = Math.max(16, windowSize.width - codeWidth - SIDE_MARGIN);
          const currentCodePos = manualPositions['Code'] ?? { x: defaultCodeX, y: TOP_MARGIN };

          // Takes complete available height with consistent margin from bottom screen border
          const targetHeight = Math.max(200, windowSize.height - BOTTOM_MARGIN - currentCodePos.y);

          return (
            <FloatingModal
              id="code"
              title="Code"
              icon={<CodeIcon />}
              width={codeWidth}
              height={targetHeight}
              position={currentCodePos}
              onPositionChange={(pos, isManual) => handlePositionChange('Code', pos, isManual)}
              defaultDocked={typeof window !== 'undefined' && window.innerWidth < 1024 ? 'right' : 'none'}
              noPadding
              onClose={() => toggleModal('Code')}
            >
              <div style={{ height: '100%', width: '100%' }}>
                <LiveCodeEditor
                  code={pickerState.code}
                  onChange={pickerState.updateFromCode}
                  error={pickerState.codeError}
                  mode={pickerState.codeMode}
                  onModeChange={pickerState.setCodeMode}
                  onReset={pickerState.resetCode}
                  embedded
                />
              </div>
            </FloatingModal>
          );
        })()}
      </div>

      <CodeModal
        isOpen={isCodeModalOpen}
        onClose={() => setIsCodeModalOpen(false)}
        activePresetId={codeModalPresetId}
        currentProps={pickerState.props}
        code={pickerState.code}
        updateFromCode={pickerState.updateFromCode}
        codeError={pickerState.codeError}
        codeMode={pickerState.codeMode}
        setCodeMode={pickerState.setCodeMode}
        resetCode={pickerState.resetCode}
        onSelectPreset={pickerState.loadPreset}
      />
    </div>
  );
}

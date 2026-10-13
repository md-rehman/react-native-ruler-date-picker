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

function getPropValue(props: Record<string, any>, name: string) {
  if (name.startsWith('theme.')) {
    const key = name.split('.')[1];
    return props.theme?.[key];
  }
  return props[name];
}

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

  const PANEL_WIDTH = 320;
  const HORIZONTAL_GAP = 16;
  const VERTICAL_GAP = 16;
  const TOP_MARGIN = 80;
  const BOTTOM_MARGIN = 24;
  const RIGHT_MARGIN = 24;

  const [visibleModals, setVisibleModals] = useState<Record<Category, boolean>>({
    Selection: true,
    Dimensions: true,
    Colors: true,
    Features: true
  });

  // Track the order in which modals were opened/activated
  const [openOrder, setOpenOrder] = useState<Category[]>([...categories]);

  // Track DOM rendered heights of panels (with sensible defaults)
  const [panelHeights, setPanelHeights] = useState<Record<Category, number>>({
    Selection: 380,
    Dimensions: 320,
    Colors: 340,
    Features: 350,
  });

  // User manually moved positions
  const [manualPositions, setManualPositions] = useState<Partial<Record<Category, { x: number; y: number }>>>({});

  // Viewport dimensions
  const [windowSize, setWindowSize] = useState<{ width: number; height: number }>({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 900,
  });

  // Load manual positions from localStorage on mount (only for opened panels per Req 3)
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const loaded: Partial<Record<Category, { x: number; y: number }>> = {};
    categories.forEach((cat) => {
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

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Compute auto-layout positions for panels that do NOT have manual positions
  const computedPositions = React.useMemo(() => {
    const col0X = Math.max(16, windowSize.width - PANEL_WIDTH - RIGHT_MARGIN);
    const maxAvailableY = windowSize.height - BOTTOM_MARGIN;

    // Filter to currently visible panels in open order
    const activePanels = openOrder.filter((cat) => visibleModals[cat]);

    // Panels that need auto-layout (i.e. not manually dragged)
    const autoPanels = activePanels.filter((cat) => !manualPositions[cat]);

    const result: Partial<Record<Category, { x: number; y: number }>> = {};
    let currentColumnIndex = 0;
    let currentY = TOP_MARGIN;

    autoPanels.forEach((category) => {
      const h = panelHeights[category] || 350;

      // Check if this panel fits in the current column (Req 2b vs 2c)
      // If currentY > TOP_MARGIN and it exceeds available height, start a new column on the left
      if (currentY > TOP_MARGIN && currentY + h > maxAvailableY) {
        currentColumnIndex += 1;
        currentY = TOP_MARGIN;
      }

      const colX = Math.max(16, col0X - currentColumnIndex * (PANEL_WIDTH + HORIZONTAL_GAP));
      result[category] = { x: colX, y: currentY };

      currentY += h + VERTICAL_GAP;
    });

    return result;
  }, [windowSize, openOrder, visibleModals, panelHeights, manualPositions]);

  // Requirement 1 & 2: Toggle modal logic
  const toggleModal = (category: Category) => {
    const isCurrentlyVisible = visibleModals[category];
    const willBeVisible = !isCurrentlyVisible;

    if (!willBeVisible) {
      // Requirement 1: When panel are toggle off their position should reset.
      // Requirement 3: In local storage we only preserve the position of opened pane.
      if (typeof window !== 'undefined') {
        localStorage.removeItem(`modal-${category.toLowerCase()}`);
      }
      setManualPositions((mp) => {
        const next = { ...mp };
        delete next[category];
        return next;
      });
      setOpenOrder((order) => order.filter((c) => c !== category));
    } else {
      // Requirement 2: When panel is toggled on:
      // Clear any manual position so it resets and auto-layouts
      if (typeof window !== 'undefined') {
        localStorage.removeItem(`modal-${category.toLowerCase()}`);
      }
      setManualPositions((mp) => {
        const next = { ...mp };
        delete next[category];
        return next;
      });
      // Add to open order at the end so it comes after already open panels
      setOpenOrder((order) => [...order.filter((c) => c !== category), category]);
    }

    setVisibleModals((prev) => ({ ...prev, [category]: willBeVisible }));
  };

  // Requirement 5: When reset is clicked, recalculate positions of all open panels neatly
  const handleResetModals = () => {
    // 1. Clear manual positions for all categories
    categories.forEach((cat) => {
      localStorage.removeItem(`modal-${cat.toLowerCase()}`);
    });
    setManualPositions({});

    // 2. Normalize openOrder to canonical order of currently visible panels
    const currentOpen = categories.filter((c) => visibleModals[c]);
    setOpenOrder(currentOpen.length > 0 ? currentOpen : [...categories]);

    // 3. Dispatch reset event to undock/uncollapse modals
    window.dispatchEvent(new Event('resetModals'));
  };

  // Requirement 4: When open panel is moved, update state and local storage
  const handlePositionChange = React.useCallback((category: Category, pos: { x: number; y: number }, isManual: boolean) => {
    if (isManual) {
      setManualPositions((prev) => ({
        ...prev,
        [category]: pos,
      }));
    }
  }, []);

  const handleHeightChange = React.useCallback((category: Category, height: number) => {
    setPanelHeights((prev) => {
      if (Math.abs(prev[category] - height) < 2) return prev;
      return { ...prev, [category]: height };
    });
  }, []);

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

          const col0X = Math.max(16, windowSize.width - PANEL_WIDTH - RIGHT_MARGIN);
          const currentPos = manualPositions[category] ?? computedPositions[category] ?? { x: col0X, y: TOP_MARGIN };
          
          return (
            <FloatingModal
              key={category}
              id={category.toLowerCase()}
              title={category}
              icon={IconComponent}
              position={currentPos}
              onPositionChange={(pos, isManual) => handlePositionChange(category, pos, isManual)}
              onHeightChange={(h) => handleHeightChange(category, h)}
              defaultDocked={typeof window !== 'undefined' && window.innerWidth < 1024 ? 'right' : 'none'}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                {categoryProps.map(prop => (
                  <PropControl
                    key={prop.name}
                    definition={prop}
                    value={getPropValue(pickerState.props, prop.name)}
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


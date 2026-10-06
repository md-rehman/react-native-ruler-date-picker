import React from 'react';
import styles from './ModalToggle.module.css';

export type ModalCategory = 'Selection' | 'Dimensions' | 'Colors' | 'Features';

interface ModalToggleProps {
  visibleModals: Record<ModalCategory, boolean>;
  onToggle: (category: ModalCategory) => void;
}

export const SelectionIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"></path>
    <path d="M13 13l6 6"></path>
  </svg>
);

export const DimensionsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m21 21-6-6m6 6v-4.8m0 4.8h-4.8"></path>
    <path d="M3 16.2V21m0 0h4.8M3 21l6-6"></path>
    <path d="M21 7.8V3m0 0h-4.8M21 3l-6 6"></path>
    <path d="M3 7.8V3m0 0h4.8M3 3l6 6"></path>
  </svg>
);

export const ColorsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="13.5" cy="6.5" r=".5" fill="currentColor"></circle>
    <circle cx="17.5" cy="10.5" r=".5" fill="currentColor"></circle>
    <circle cx="8.5" cy="7.5" r=".5" fill="currentColor"></circle>
    <circle cx="6.5" cy="12.5" r=".5" fill="currentColor"></circle>
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"></path>
  </svg>
);

export const FeaturesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" y1="21" x2="4" y2="14"></line>
    <line x1="4" y1="10" x2="4" y2="3"></line>
    <line x1="12" y1="21" x2="12" y2="12"></line>
    <line x1="12" y1="8" x2="12" y2="3"></line>
    <line x1="20" y1="21" x2="20" y2="16"></line>
    <line x1="20" y1="12" x2="20" y2="3"></line>
    <line x1="1" y1="14" x2="7" y2="14"></line>
    <line x1="9" y1="8" x2="15" y2="8"></line>
    <line x1="17" y1="16" x2="23" y2="16"></line>
  </svg>
);

export default function ModalToggle({ visibleModals, onToggle }: ModalToggleProps) {
  return (
    <div className={styles.selector}>
      <button
        className={`${styles.button} ${visibleModals['Selection'] ? styles.active : ''}`}
        onClick={() => onToggle('Selection')}
        title="Toggle Selection Settings"
      >
        <SelectionIcon />
      </button>
      <button
        className={`${styles.button} ${visibleModals['Dimensions'] ? styles.active : ''}`}
        onClick={() => onToggle('Dimensions')}
        title="Toggle Dimensions Settings"
      >
        <DimensionsIcon />
      </button>
      <button
        className={`${styles.button} ${visibleModals['Colors'] ? styles.active : ''}`}
        onClick={() => onToggle('Colors')}
        title="Toggle Colors Settings"
      >
        <ColorsIcon />
      </button>
      <button
        className={`${styles.button} ${visibleModals['Features'] ? styles.active : ''}`}
        onClick={() => onToggle('Features')}
        title="Toggle Features Settings"
      >
        <FeaturesIcon />
      </button>
    </div>
  );
}

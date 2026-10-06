export type DeviceType = 'web' | 'iphone' | 'android';

interface DeviceSelectorProps {
  activeDevice: DeviceType;
  onChange: (device: DeviceType) => void;
}

import styles from "./DeviceSelector.module.css";

export default function DeviceSelector({ activeDevice, onChange }: DeviceSelectorProps) {
  return (
    <div className={styles.selector}>
      <button
        className={`${styles.button} ${activeDevice === 'web' ? styles.active : ''}`}
        onClick={() => onChange('web')}
        title="Web Browser"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
          <line x1="8" y1="21" x2="16" y2="21"></line>
          <line x1="12" y1="17" x2="12" y2="21"></line>
        </svg>
      </button>
      <button
        className={`${styles.button} ${activeDevice === 'iphone' ? styles.active : ''}`}
        onClick={() => onChange('iphone')}
        title="iPhone"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
          <line x1="12" y1="18" x2="12.01" y2="18"></line>
        </svg>
      </button>
      <button
        className={`${styles.button} ${activeDevice === 'android' ? styles.active : ''}`}
        onClick={() => onChange('android')}
        title="Android"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
          <line x1="9" y1="2" x2="15" y2="2"></line>
          <line x1="12" y1="18" x2="12.01" y2="18"></line>
        </svg>
      </button>
      
      {/* Sliding indicator */}
      <div 
        className={styles.indicator} 
        data-device={activeDevice}
      />
    </div>
  );
}

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
        title="Apple"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 7c-3 0 -4 3 -4 5.5c0 3 2 7.5 4 7.5c1.088 -.046 1.679 -.5 3 -.5c1.312 0 1.5 .5 3 .5s4 -3 4 -5c-.028 -.01 -2.472 -.403 -2.5 -3c-.019 -2.17 2.416 -2.954 2.5 -3c-1.023 -1.492 -2.951 -1.963 -3.5 -2c-1.433 -.111 -2.83 1 -3.5 1c-.68 0 -1.9 -1 -3 -1z" />
          <path d="M12 4a2 2 0 0 0 2 -2a2 2 0 0 0 -2 2" />
        </svg>
      </button>
      <button
        className={`${styles.button} ${activeDevice === 'android' ? styles.active : ''}`}
        onClick={() => onChange('android')}
        title="Android"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 10l0 6" />
          <path d="M20 10l0 6" />
          <path d="M7 9h10v8a1 1 0 0 1 -1 1h-8a1 1 0 0 1 -1 -1v-8a5 5 0 0 1 10 0" />
          <path d="M8 3l1 2" />
          <path d="M16 3l-1 2" />
          <path d="M9 18l0 3" />
          <path d="M15 18l0 3" />
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

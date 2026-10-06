import React from 'react';
import DeviceSelector, { DeviceType } from '../DeviceSelector/DeviceSelector';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import styles from './TopBar.module.css';

interface TopBarProps {
  activeDevice: DeviceType;
  onDeviceChange: (device: DeviceType) => void;
  onToggleLeftNav?: () => void;
  onToggleRightNav?: () => void;
}

export default function TopBar({ 
  activeDevice, 
  onDeviceChange,
  onToggleLeftNav,
  onToggleRightNav
}: TopBarProps) {
  return (
    <header className={`${styles.topbar} glass`}>
      <div className={styles.left}>
        <button className={styles.navToggle} onClick={onToggleLeftNav} aria-label="Toggle Left Navigation">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
        <span className={styles.title}>Demo</span>
      </div>
      
      <div className={styles.center}>
        <DeviceSelector activeDevice={activeDevice} onChange={onDeviceChange} />
      </div>

      <div className={styles.right}>
        <ThemeToggle />
        <button className={styles.navToggle} onClick={onToggleRightNav} aria-label="Toggle Right Navigation">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="15" y1="3" x2="15" y2="21"></line>
          </svg>
        </button>
      </div>
    </header>
  );
}

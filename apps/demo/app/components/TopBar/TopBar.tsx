import React from 'react';
import DeviceSelector, { DeviceType } from '../DeviceSelector/DeviceSelector';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import styles from './TopBar.module.css';

interface TopBarProps {
  activeDevice: DeviceType;
  onDeviceChange: (device: DeviceType) => void;
}

export default function TopBar({ 
  activeDevice, 
  onDeviceChange
}: TopBarProps) {
  return (
    <header className={`${styles.topbar} glass`}>
      <div className={styles.left}>
        <span className={styles.title}>Demo</span>
      </div>
      
      <div className={styles.center}>
        <DeviceSelector activeDevice={activeDevice} onChange={onDeviceChange} />
      </div>

      <div className={styles.right}>
        <ThemeToggle />
      </div>
    </header>
  );
}

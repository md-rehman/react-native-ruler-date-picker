import React from 'react';
import DeviceSelector, { DeviceType } from '../DeviceSelector/DeviceSelector';
import ModalToggle, { ModalCategory } from '../ModalToggle/ModalToggle';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import styles from './TopBar.module.css';

interface TopBarProps {
  activeDevice: DeviceType;
  onDeviceChange: (device: DeviceType) => void;
  visibleModals: Record<ModalCategory, boolean>;
  onToggleModal: (category: ModalCategory) => void;
}

export default function TopBar({ 
  activeDevice, 
  onDeviceChange,
  visibleModals,
  onToggleModal
}: TopBarProps) {
  return (
    <header className={styles.topbar}>
      <div className={styles.left}></div>
      
      <div className={styles.center}>
        <DeviceSelector activeDevice={activeDevice} onChange={onDeviceChange} />
      </div>

      <div className={styles.right}>
        <ModalToggle visibleModals={visibleModals} onToggle={onToggleModal} />
        <ThemeToggle />
      </div>
    </header>
  );
}

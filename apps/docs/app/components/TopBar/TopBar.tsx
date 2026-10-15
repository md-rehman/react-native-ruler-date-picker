import React from 'react';
import Link from 'next/link';
import DeviceSelector, { DeviceType } from '../DeviceSelector/DeviceSelector';
import ModalToggle, { ModalCategory } from '../ModalToggle/ModalToggle';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import GlassControls from '../GlassControls/GlassControls';
import Logo from '../Logo/Logo';
import styles from './TopBar.module.css';

interface TopBarProps {
  activeDevice: DeviceType;
  onDeviceChange: (device: DeviceType) => void;
  visibleModals: Record<ModalCategory, boolean>;
  onToggleModal: (category: ModalCategory) => void;
  onResetModals: () => void;
  onOpenCodeModal: () => void;
}

export default function TopBar({
  activeDevice,
  onDeviceChange,
  visibleModals,
  onToggleModal,
  onResetModals,
  onOpenCodeModal
}: TopBarProps) {
  return (
    <header className={styles.topbar}>
      <div className={styles.left}>
        <Link href="/" className={styles.brandLink} title="Home" aria-label="Home">
          <Logo size={32} />
        </Link>
        <Link href="/docs" className={styles.docsButton} title="Documentation" aria-label="Docs">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
          </svg>
          <span>Docs</span>
        </Link>
      </div>

      <div className={styles.center}>
        <DeviceSelector activeDevice={activeDevice} onChange={onDeviceChange} />
      </div>

      <div className={styles.right}>
        <button
          className={styles.codeButton}
          onClick={onOpenCodeModal}
          title="View & Copy Example Code"
          aria-label="View Code"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 18 22 12 16 6"></polyline>
            <polyline points="8 6 2 12 8 18"></polyline>
          </svg>
          <span>Code</span>
        </button>
        <ModalToggle visibleModals={visibleModals} onToggle={onToggleModal} onReset={onResetModals} />
        <GlassControls />
        <ThemeToggle />
      </div>
    </header>
  );
}

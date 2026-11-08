"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import DeviceSelector, { DeviceType } from '../DeviceSelector/DeviceSelector';
import ModalToggle, { ModalCategory } from '../ModalToggle/ModalToggle';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import GlassControls from '../GlassControls/GlassControls';
import Logo from '../Logo/Logo';
import SearchModal from '../SearchModal/SearchModal';
import TopBarSettingsMenu from './TopBarSettingsMenu';
import styles from './TopBar.module.css';

interface TopBarProps {
  activeDevice?: DeviceType;
  onDeviceChange?: (device: DeviceType) => void;
  visibleModals?: Record<ModalCategory, boolean>;
  onToggleModal?: (category: ModalCategory) => void;
  onResetModals?: () => void;
}

export default function TopBar({
  activeDevice,
  onDeviceChange,
  visibleModals,
  onToggleModal,
  onResetModals,
}: TopBarProps = {}) {
  const pathname = usePathname();
  const isPlayground = pathname?.startsWith('/playground');
  const isDocs = pathname?.startsWith('/docs');
  const isHome = pathname === '/' || (!isPlayground && !isDocs);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMac, setIsMac] = useState(true);

  useEffect(() => {
    setIsMac(/(Mac|iPhone|iPod|iPad)/i.test(navigator.platform || navigator.userAgent));
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <header className={styles.topbar}>
        <div className={styles.left}>
          <Link href="/" className={styles.brandLink} title="Home" aria-label="Home">
            <Logo size={32} />
          </Link>

          {isPlayground && (
            <Link href="/docs" className={styles.navButton} title="Documentation" aria-label="Docs">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
              </svg>
              <span>Docs</span>
            </Link>
          )}

          {isDocs && (
            <Link href="/playground" className={styles.navButton} title="Interactive Playground" aria-label="Playground">
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="6 3 20 12 6 21 6 3"></polygon>
              </svg>
              <span>Playground</span>
            </Link>
          )}

          {isHome && (
            <>
              <Link href="/docs" className={styles.navButton} title="Documentation" aria-label="Docs">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                </svg>
                <span>Docs</span>
              </Link>
              <Link href="/playground" className={styles.navButton} title="Interactive Playground" aria-label="Playground">
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="6 3 20 12 6 21 6 3"></polygon>
                </svg>
                <span>Playground</span>
              </Link>
            </>
          )}
        </div>

        {isPlayground && activeDevice && onDeviceChange && (
          <div className={styles.center}>
            <DeviceSelector activeDevice={activeDevice} onChange={onDeviceChange} />
          </div>
        )}

        {isDocs && (
          <div className={styles.center}>
            <button
              id="topbar-search-btn"
              className={styles.searchButton}
              onClick={() => setIsSearchOpen(true)}
              title={`Search documentation (${isMac ? '⌘K' : 'Ctrl K'})`}
              aria-label="Search documentation"
            >
              <svg
                className={styles.searchIcon}
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <span className={styles.searchText}>Search documentation...</span>
              <kbd className={styles.searchKbd}>{isMac ? '⌘K' : 'Ctrl K'}</kbd>
            </button>
          </div>
        )}

        <div className={styles.right}>
          {isPlayground && visibleModals && onToggleModal && onResetModals && (
            <div className={styles.desktopModalToggle}>
              <ModalToggle visibleModals={visibleModals} onToggle={onToggleModal} onReset={onResetModals} />
            </div>
          )}
          <div className={styles.desktopGlassControls}>
            <GlassControls />
          </div>
          <div className={styles.settingsMenuWrapper}>
            <TopBarSettingsMenu
              visibleModals={visibleModals}
              onToggleModal={onToggleModal}
              onResetModals={onResetModals}
            />
          </div>
          <ThemeToggle />
          <a
            href="https://github.com/md-rehman/react-native-ruler-date-picker"
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles.iconButton} ${styles.githubLink}`}
            title="GitHub Repository"
            aria-label="GitHub"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
          </a>
        </div>
      </header>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}

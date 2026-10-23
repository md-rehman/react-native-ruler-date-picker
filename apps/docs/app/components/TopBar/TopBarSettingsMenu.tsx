"use client";

import React, { useState, useRef, useEffect } from "react";
import GlassControls from "../GlassControls/GlassControls";
import ModalToggle, { ModalCategory } from "../ModalToggle/ModalToggle";
import styles from "./TopBarSettingsMenu.module.css";

interface TopBarSettingsMenuProps {
  visibleModals?: Record<ModalCategory, boolean>;
  onToggleModal?: (category: ModalCategory) => void;
  onResetModals?: () => void;
}

export default function TopBarSettingsMenu({
  visibleModals,
  onToggleModal,
  onResetModals,
}: TopBarSettingsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const hasModals = Boolean(visibleModals && onToggleModal && onResetModals);

  return (
    <div className={styles.wrapper} ref={containerRef}>
      <button
        type="button"
        className={`${styles.triggerButton} ${isOpen ? styles.triggerButtonActive : ""}`}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Controls and Settings"
        aria-expanded={isOpen}
        title="Controls and Settings"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="17"
          height="17"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
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
      </button>

      {isOpen && (
        <div className={styles.popover} role="dialog" aria-modal="true">
          {hasModals && (
            <>
              <div className={styles.panelsSection}>
                <div className={styles.sectionHeader}>
                  <span className={styles.sectionTitle}>Panels</span>
                  <span className={styles.sectionHint}>Toggle inspector tools</span>
                </div>
                <div className={styles.controlRow}>
                  <ModalToggle
                    visibleModals={visibleModals!}
                    onToggle={onToggleModal!}
                    onReset={onResetModals!}
                  />
                </div>
              </div>
              <div className={styles.divider} />
            </>
          )}

          <div className={styles.glassSection}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionTitle}>Glass Effect</span>
              <span className={styles.sectionHint}>Alpha & blur level</span>
            </div>
            <div className={styles.controlRow}>
              <GlassControls />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

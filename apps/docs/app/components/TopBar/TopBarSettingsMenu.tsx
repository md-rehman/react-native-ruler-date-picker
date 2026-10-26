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
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
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

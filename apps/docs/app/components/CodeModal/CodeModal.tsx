"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { EXAMPLES, ExamplePreset } from '../../../data/examples';
import { generateCodeSnippet, SnippetMode } from '../../../utils/generateCodeSnippet';
import LiveCodeEditor from '../LiveCodeEditor/LiveCodeEditor';
import styles from './CodeModal.module.css';

interface CodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  activePresetId?: string;
  currentProps: Record<string, any>;
  code?: string;
  updateFromCode?: (code: string) => void;
  codeError?: { message: string; line?: number; column?: number } | null;
  codeMode?: SnippetMode;
  setCodeMode?: (mode: SnippetMode) => void;
  resetCode?: () => void;
  onSelectPreset?: (preset: ExamplePreset) => void;
}

export default function CodeModal({
  isOpen,
  onClose,
  activePresetId = 'default',
  currentProps,
  code: externalCode,
  updateFromCode,
  codeError,
  codeMode = 'full',
  setCodeMode,
  resetCode,
  onSelectPreset,
}: CodeModalProps) {
  const [selectedPresetId, setSelectedPresetId] = useState<string>(activePresetId);
  const [localMode, setLocalMode] = useState<SnippetMode>(codeMode);
  const [installCopied, setInstallCopied] = useState(false);

  // Synchronize preset selection whenever modal is opened
  useEffect(() => {
    if (isOpen) {
      setSelectedPresetId(activePresetId);
    }
  }, [isOpen, activePresetId]);

  // Handle ESC key press
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Handle preset dropdown selection
  const handlePresetChange = (presetId: string) => {
    setSelectedPresetId(presetId);
    if (presetId === 'custom') return;
    const found = EXAMPLES.find((ex) => ex.id === presetId);
    if (found && onSelectPreset) {
      onSelectPreset(found);
    }
  };

  const handleCopyInstall = () => {
    const text = 'pnpm add react-native-ruler-date-picker react-native-reanimated react-native-gesture-handler';
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
    }
    setInstallCopied(true);
    setTimeout(() => setInstallCopied(false), 2000);
  };

  const currentMode = setCodeMode ? codeMode : localMode;
  const handleModeChange = (newMode: SnippetMode) => {
    if (setCodeMode) {
      setCodeMode(newMode);
    } else {
      setLocalMode(newMode);
    }
  };

  const effectiveCode = externalCode || generateCodeSnippet({
    props: currentProps,
    presetName: 'Custom Configuration',
    mode: currentMode,
  });

  if (!isOpen) return null;

  return (
    <div
      className={styles.overlay}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={`${styles.modal} glass`}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.titleArea}>
            <span className={styles.codeIcon}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 18 22 12 16 6"></polyline>
                <polyline points="8 6 2 12 8 18"></polyline>
              </svg>
            </span>
            <h2 className={styles.title}>Live Code Editor & Examples</h2>
          </div>

          <div className={styles.controls}>
            {/* Preset Selector */}
            <select
              className={styles.presetSelect}
              value={selectedPresetId}
              onChange={(e) => handlePresetChange(e.target.value)}
              title="Select preset configuration"
            >
              <option value="custom">⚡ Current Configuration</option>
              <optgroup label="Presets">
                {EXAMPLES.map((ex) => (
                  <option key={ex.id} value={ex.id}>
                    {ex.name}
                  </option>
                ))}
              </optgroup>
            </select>

            {/* Close Button */}
            <button
              className={styles.closeBtn}
              onClick={onClose}
              title="Close Modal (Esc)"
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>

        {/* Live Code Editor Body */}
        <div style={{ height: '520px', width: '100%' }}>
          <LiveCodeEditor
            code={effectiveCode}
            onChange={updateFromCode || (() => {})}
            error={codeError}
            mode={currentMode}
            onModeChange={handleModeChange}
            onReset={resetCode}
            title={selectedPresetId === 'custom' ? 'Custom Live Editor' : EXAMPLES.find(e => e.id === selectedPresetId)?.name ?? 'Live Editor'}
          />
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <div
            className={styles.installCommand}
            onClick={handleCopyInstall}
            title="Click to copy install command"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="4 17 10 11 4 5"></polyline>
              <line x1="12" y1="19" x2="20" y2="19"></line>
            </svg>
            <span>pnpm add react-native-ruler-date-picker</span>
            <span style={{ fontSize: '0.7rem', color: installCopied ? '#10B981' : 'var(--color-text-muted)', marginLeft: 4 }}>
              {installCopied ? '✓ Copied!' : '(Click to copy)'}
            </span>
          </div>

          <div className={styles.badge}>
            <span>Live two-way synchronization active with preview</span>
          </div>
        </div>
      </div>
    </div>
  );
}

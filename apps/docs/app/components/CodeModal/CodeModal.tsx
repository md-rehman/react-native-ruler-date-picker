"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { EXAMPLES, ExamplePreset } from '../../../data/examples';
import { generateCodeSnippet, SnippetMode } from '../../../utils/generateCodeSnippet';
import CodeHighlighter from './CodeHighlighter';
import styles from './CodeModal.module.css';

interface CodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  activePresetId?: string;
  currentProps: Record<string, any>;
}

export default function CodeModal({
  isOpen,
  onClose,
  activePresetId = 'default',
  currentProps
}: CodeModalProps) {
  const [selectedPresetId, setSelectedPresetId] = useState<string>(activePresetId);
  const [mode, setMode] = useState<SnippetMode>('full');
  const [copied, setCopied] = useState(false);
  const [installCopied, setInstallCopied] = useState(false);

  // Synchronize preset selection whenever modal is opened
  useEffect(() => {
    if (isOpen) {
      setSelectedPresetId(activePresetId);
      setCopied(false);
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

  // Resolve target props & preset name
  const { targetProps, targetName } = useMemo(() => {
    if (selectedPresetId === 'custom') {
      return {
        targetProps: currentProps,
        targetName: 'Custom Setup'
      };
    }
    const found = EXAMPLES.find((ex) => ex.id === selectedPresetId);
    if (found) {
      return {
        targetProps: found.props,
        targetName: found.name
      };
    }
    return {
      targetProps: currentProps,
      targetName: 'Custom Setup'
    };
  }, [selectedPresetId, currentProps]);

  // Generate code snippet
  const code = useMemo(() => {
    return generateCodeSnippet({
      props: targetProps,
      presetName: targetName,
      mode
    });
  }, [targetProps, targetName, mode]);

  const copyToClipboard = async (text: string, onSuccess: () => void) => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      onSuccess();
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleCopyCode = () => {
    copyToClipboard(code, () => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleCopyInstall = () => {
    copyToClipboard('pnpm add react-native-ruler-date-picker react-native-reanimated react-native-gesture-handler', () => {
      setInstallCopied(true);
      setTimeout(() => setInstallCopied(false), 2000);
    });
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}>
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
            <h2 className={styles.title}>Example Code</h2>
          </div>

          <div className={styles.controls}>
            {/* Preset Selector */}
            <select
              className={styles.presetSelect}
              value={selectedPresetId}
              onChange={(e) => setSelectedPresetId(e.target.value)}
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

            {/* Mode Toggle: Full vs JSX */}
            <div className={styles.modeToggle}>
              <button
                className={`${styles.modeBtn} ${mode === 'full' ? styles.modeBtnActive : ''}`}
                onClick={() => setMode('full')}
                title="Full Component with imports and state"
              >
                Component
              </button>
              <button
                className={`${styles.modeBtn} ${mode === 'jsx' ? styles.modeBtnActive : ''}`}
                onClick={() => setMode('jsx')}
                title="JSX invocation only"
              >
                JSX Only
              </button>
            </div>

            {/* Copy Button */}
            <button
              className={`${styles.copyBtn} ${copied ? styles.copyBtnCopied : ''}`}
              onClick={handleCopyCode}
              title="Copy code to clipboard"
            >
              {copied ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                  <span>Copy Code</span>
                </>
              )}
            </button>

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

        {/* Code Content */}
        <div className={styles.body}>
          <CodeHighlighter code={code} />
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
            <span>Ready to paste directly into your React Native or Expo app</span>
          </div>
        </div>
      </div>
    </div>
  );
}

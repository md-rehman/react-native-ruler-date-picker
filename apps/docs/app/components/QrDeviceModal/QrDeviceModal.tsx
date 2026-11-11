"use client";

import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import styles from './QrDeviceModal.module.css';

interface QrDeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  snackUrl?: string;
}

export const KITCHENSINK_SNACK_URL =
  'https://snack.expo.dev/@md-rehman/ruler-date-picker---kitchensink';

export default function QrDeviceModal({
  isOpen,
  onClose,
  snackUrl = KITCHENSINK_SNACK_URL,
}: QrDeviceModalProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(snackUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Failed to copy Snack URL', e);
    }
  };

  return (
    <div className={styles.backdrop} onClick={onClose} role="dialog" aria-modal="true">
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.iconWrapper}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                <line x1="12" y1="18" x2="12.01" y2="18" />
              </svg>
            </div>
            <div className={styles.headerTitles}>
              <h3 className={styles.title}>
                Test on Real Device
                <span className={styles.badge}>Kitchensink</span>
              </h3>
              <span className={styles.subtitle}>Open directly in Expo Go</span>
            </div>
          </div>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close dialog"
            title="Close (Esc)"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className={styles.content}>
          {/* QR Code Container */}
          <div className={styles.qrContainer}>
            <div className={styles.qrCard}>
              <QRCodeSVG
                value={snackUrl}
                size={180}
                level="M"
                includeMargin={true}
                fgColor="#000000"
                bgColor="#FFFFFF"
              />
            </div>
            <div className={styles.pulseTag}>
              <span className={styles.pulseDot} />
              Scan with phone camera or Expo Go
            </div>
          </div>

          {/* Feature Badge */}
          <div className={styles.featurePill}>
            <svg className={styles.featureIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
            <span>
              <strong>Dual-speed haptics:</strong> Feel physical taptic tick feedback and 60 FPS gesture momentum on your hardware.
            </span>
          </div>

          {/* OS Instructions Grid */}
          <div className={styles.instructionsGrid}>
            <div className={styles.instructionCard}>
              <div className={styles.instructionHeader}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.75 1.04-1.8 0.92-2.85-.9.04-2 .6-2.65 1.35-.58.67-.99 1.74-.88 2.76 1.02.08 2.02-.51 2.61-1.26z" />
                </svg>
                iOS (iPhone)
              </div>
              <p className={styles.instructionText}>
                Open the standard <strong>Camera</strong> app and tap the <strong>Open in Expo Go</strong> banner.
              </p>
            </div>

            <div className={styles.instructionCard}>
              <div className={styles.instructionHeader}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.551 0 .9993.4482.9993.9993.0001.5511-.4483.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993 0 .5511-.4482.9997-.9993.9997m11.4045-6.02l1.997-3.4592a.416.416 0 00-.152-.5677.416.416 0 00-.568.152l-2.022 3.503c-1.488-.679-3.155-1.066-4.949-1.066-1.794 0-3.461.387-4.949 1.066L5.2155 5.4465a.416.416 0 00-.568-.152.416.416 0 00-.152.5677l1.997 3.4592C2.688 11.186.195 15.047.016 19.638h23.968c-.179-4.591-2.672-8.452-6.1015-10.3166" />
                </svg>
                Android
              </div>
              <p className={styles.instructionText}>
                Open the <strong>Expo Go</strong> app and tap <strong>Scan QR code</strong> from the home screen.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <div className={styles.footerButtons}>
            <button className={styles.copyButton} onClick={handleCopy}>
              {copied ? (
                <>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Link Copied!</span>
                </>
              ) : (
                <>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                  <span>Copy Snack Link</span>
                </>
              )}
            </button>
            <a
              href={snackUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.openLinkButton}
            >
              <span>Open in Snack</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}


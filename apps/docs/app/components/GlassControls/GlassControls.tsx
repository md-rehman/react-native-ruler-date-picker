"use client";

import { useEffect, useState, useCallback } from "react";
import { useTheme } from "../../../context/ThemeContext";
import styles from "./GlassControls.module.css";

export default function GlassControls() {
  const { theme } = useTheme();
  const [alpha, setAlpha] = useState(25);
  const [blur, setBlur] = useState(5);

  const updateValuesFromCSS = useCallback(() => {
    // Check alpha
    const inlineAlpha = document.documentElement.style.getPropertyValue('--glass-bg-alpha').trim();
    if (inlineAlpha) {
      setAlpha(Math.round(parseFloat(inlineAlpha) * 100));
    } else {
      const computedStyle = getComputedStyle(document.documentElement);
      const alphaVar = computedStyle.getPropertyValue('--glass-bg-alpha').trim();
      if (alphaVar) {
        setAlpha(Math.round(parseFloat(alphaVar) * 100));
      }
    }

    // Check blur
    const inlineBlur = document.documentElement.style.getPropertyValue('--glass-blur').trim();
    if (inlineBlur) {
      setBlur(parseInt(inlineBlur, 10));
    } else {
      const computedStyle = getComputedStyle(document.documentElement);
      const blurVar = computedStyle.getPropertyValue('--glass-blur').trim();
      if (blurVar) {
        setBlur(parseInt(blurVar, 10));
      }
    }
  }, []);

  useEffect(() => {
    updateValuesFromCSS();
  }, [theme, updateValuesFromCSS]);

  const handleAlphaClick = () => {
    setAlpha((prev) => {
      let next = prev + 5;
      if (next > 100) {
        next = 0;
      }
      const val = String(next / 100);
      document.documentElement.style.setProperty('--glass-bg-alpha', val);
      localStorage.setItem('glass-alpha', val);
      return next;
    });
  };

  const handleBlurClick = () => {
    setBlur((prev) => {
      let next = prev + 1;
      if (next > 20) {
        next = 0;
      }
      const val = `${next}px`;
      document.documentElement.style.setProperty('--glass-blur', val);
      localStorage.setItem('glass-blur', val);
      return next;
    });
  };

  const handleReset = () => {
    setAlpha(25);
    setBlur(5);
    document.documentElement.style.setProperty('--glass-bg-alpha', '0.25');
    document.documentElement.style.setProperty('--glass-blur', '5px');
    localStorage.removeItem('glass-alpha');
    localStorage.removeItem('glass-blur');
  };

  return (
    <div className={styles.selector}>
      <button
        className={styles.button}
        onClick={handleAlphaClick}
        aria-label="Toggle Glass Alpha"
        title="Glass Alpha"
      >
        <span className={styles.number}>{alpha}</span>
      </button>
      <button
        className={styles.button}
        onClick={handleBlurClick}
        aria-label="Toggle Glass Blur"
        title="Glass Blur"
      >
        <span className={styles.number}>{blur}</span>
      </button>
      <div style={{ width: '1px', backgroundColor: 'var(--glass-border)', margin: '4px 2px' }} />
      <button
        className={styles.button}
        onClick={handleReset}
        aria-label="Reset Glass"
        title="Reset Glass"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
          <path d="M3 3v5h5"></path>
        </svg>
      </button>
    </div>
  );
}

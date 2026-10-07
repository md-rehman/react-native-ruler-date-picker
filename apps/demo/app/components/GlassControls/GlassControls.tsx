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
      document.documentElement.style.setProperty('--glass-bg-alpha', String(next / 100));
      return next;
    });
  };

  const handleBlurClick = () => {
    setBlur((prev) => {
      let next = prev + 1;
      if (next > 20) {
        next = 0;
      }
      document.documentElement.style.setProperty('--glass-blur', `${next}px`);
      return next;
    });
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
    </div>
  );
}

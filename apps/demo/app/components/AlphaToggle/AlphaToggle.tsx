"use client";

import { useEffect, useState, useCallback } from "react";
import { useTheme } from "../../../context/ThemeContext";
import styles from "./AlphaToggle.module.css";

export default function AlphaToggle() {
  const { theme } = useTheme();
  const [alpha, setAlpha] = useState(10);

  const updateAlphaFromCSS = useCallback(() => {
    // Check if there is an inline style on documentElement first
    const inlineAlpha = document.documentElement.style.getPropertyValue('--glass-bg-alpha').trim();
    if (inlineAlpha) {
      setAlpha(Math.round(parseFloat(inlineAlpha) * 100));
      return;
    }
    
    // Otherwise, read computed style
    const computedStyle = getComputedStyle(document.documentElement);
    const alphaVar = computedStyle.getPropertyValue('--glass-bg-alpha').trim();
    if (alphaVar) {
      setAlpha(Math.round(parseFloat(alphaVar) * 100));
    }
  }, []);

  useEffect(() => {
    updateAlphaFromCSS();
  }, [theme, updateAlphaFromCSS]);

  const handleClick = () => {
    setAlpha((prev) => {
      let next = prev + 5;
      if (next > 100) {
        next = 0;
      }
      document.documentElement.style.setProperty('--glass-bg-alpha', String(next / 100));
      return next;
    });
  };

  return (
    <button
      className={styles.toggle}
      onClick={handleClick}
      aria-label="Toggle Glass Alpha"
      title={`Current Glass Alpha: ${alpha}%`}
    >
      <span className={styles.number}>{alpha}</span>
    </button>
  );
}

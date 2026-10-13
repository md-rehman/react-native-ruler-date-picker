import React from 'react';
import styles from './PropControl.module.css';

interface ColorPickerProps {
  value: string;
  onChange: (value: string) => void;
}

export default function ColorPicker({ value, onChange }: ColorPickerProps) {
  return (
    <div className={styles.colorPickerWrapper}>
      <input 
        type="color" 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        className={styles.colorInput}
      />
      <input 
        type="text" 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${styles.input} ${styles.colorHex}`}
      />
    </div>
  );
}

import React from 'react';
import styles from './PropControl.module.css';

interface BooleanToggleProps {
  value: boolean;
  onChange: (value: boolean) => void;
}

export default function BooleanToggle({ value, onChange }: BooleanToggleProps) {
  return (
    <label className={styles.toggleLabel}>
      <input 
        type="checkbox" 
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
        className={styles.toggleInput}
      />
      <div className={styles.toggleTrack}>
        <div className={styles.toggleThumb} />
      </div>
    </label>
  );
}

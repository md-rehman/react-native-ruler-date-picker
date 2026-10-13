import React from 'react';
import styles from './PropControl.module.css';

interface NumberInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

export default function NumberInput({ value, onChange, min, max, step }: NumberInputProps) {
  return (
    <input 
      type="number" 
      value={value} 
      onChange={(e) => onChange(Number(e.target.value))}
      min={min}
      max={max}
      step={step}
      className={styles.input}
    />
  );
}

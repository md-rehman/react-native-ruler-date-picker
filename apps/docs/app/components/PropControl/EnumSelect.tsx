import React from 'react';
import styles from './PropControl.module.css';

interface EnumSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
}

export default function EnumSelect({ value, onChange, options }: EnumSelectProps) {
  return (
    <select 
      value={value} 
      onChange={(e) => onChange(e.target.value)}
      className={`${styles.input} ${styles.enumSelect}`}
    >
      {options.map(opt => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  );
}

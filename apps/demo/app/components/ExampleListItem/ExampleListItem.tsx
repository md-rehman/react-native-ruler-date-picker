import React from 'react';
import { ExamplePreset } from '../../../data/examples';
import styles from './ExampleListItem.module.css';

interface ExampleListItemProps {
  example: ExamplePreset;
  isActive: boolean;
  onClick: () => void;
}

export default function ExampleListItem({ example, isActive, onClick }: ExampleListItemProps) {
  return (
    <button 
      className={`${styles.item} ${isActive ? styles.active : ''}`}
      onClick={onClick}
    >
      <div className={styles.name}>{example.name}</div>
      <div className={styles.description}>{example.description}</div>
    </button>
  );
}

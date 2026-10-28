import React from 'react';
import { ExamplePreset } from '../../../data/examples';
import styles from './ExampleListItem.module.css';

interface ExampleListItemProps {
  example: ExamplePreset;
  isActive: boolean;
  onClick: () => void;
  onViewCode?: (e: React.MouseEvent) => void;
}

export default function ExampleListItem({ example, isActive, onClick, onViewCode }: ExampleListItemProps) {
  return (
    <div 
      className={`${styles.item} ${isActive ? styles.active : ''}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick();
        }
      }}
    >
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <span className={styles.name}>{example.name}</span>
          {example.badge && (
            <span className={styles.badge}>{example.badge}</span>
          )}
        </div>
        {onViewCode && (
          <button
            className={styles.codeBtn}
            onClick={(e) => {
              e.stopPropagation();
              onViewCode(e);
            }}
            title={`View code for ${example.name}`}
            aria-label={`View code for ${example.name}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="16 18 22 12 16 6"></polyline>
              <polyline points="8 6 2 12 8 18"></polyline>
            </svg>
            <span>Code</span>
          </button>
        )}
      </div>
      <div className={styles.description}>{example.description}</div>
    </div>
  );
}

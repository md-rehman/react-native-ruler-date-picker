import React from 'react';
import { EXAMPLES, ExamplePreset } from '../../../data/examples';
import ExampleListItem from '../ExampleListItem/ExampleListItem';
import styles from './LeftNav.module.css';

interface LeftNavProps {
  isOpen: boolean;
  onClose: () => void;
  activeExampleId: string;
  onSelectExample: (preset: ExamplePreset) => void;
}

export default function LeftNav({ isOpen, onClose, activeExampleId, onSelectExample }: LeftNavProps) {
  return (
    <nav className={`${styles.nav} glass ${isOpen ? styles.open : styles.closed}`}>
      <div className={styles.header}>
        <h2>Examples</h2>
      </div>
      <div className={styles.content}>
        {EXAMPLES.map(example => (
          <ExampleListItem 
            key={example.id}
            example={example}
            isActive={example.id === activeExampleId}
            onClick={() => {
              onSelectExample(example);
              onClose();
            }}
          />
        ))}
      </div>
    </nav>
  );
}

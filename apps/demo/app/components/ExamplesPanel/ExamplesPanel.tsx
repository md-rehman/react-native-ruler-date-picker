"use client";

import React from 'react';
import { EXAMPLES, ExamplePreset } from '../../../data/examples';
import ExampleListItem from '../ExampleListItem/ExampleListItem';
import styles from './ExamplesPanel.module.css';

interface ExamplesPanelProps {
  activeExampleId: string;
  onSelectExample: (preset: ExamplePreset) => void;
}

export default function ExamplesPanel({ activeExampleId, onSelectExample }: ExamplesPanelProps) {
  return (
    <div className={styles.content}>
      {EXAMPLES.map(example => (
        <ExampleListItem 
          key={example.id}
          example={example}
          isActive={example.id === activeExampleId}
          onClick={() => onSelectExample(example)}
        />
      ))}
    </div>
  );
}

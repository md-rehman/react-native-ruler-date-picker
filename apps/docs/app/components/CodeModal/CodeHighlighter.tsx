"use client";

import React from 'react';
import { highlightCode } from '../../../utils/highlightCode';
import styles from './CodeModal.module.css';

interface CodeHighlighterProps {
  code: string;
  language?: string;
}

export default function CodeHighlighter({ code, language = 'tsx' }: CodeHighlighterProps) {
  const lines = code.trim().split('\n');

  return (
    <div className={styles.codeContainer}>
      <pre className={styles.pre}>
        <code>
          {lines.map((line, idx) => (
            <div key={idx} className={styles.line}>
              <span className={styles.lineNumber}>{idx + 1}</span>
              <span
                className={styles.lineContent}
                dangerouslySetInnerHTML={{
                  __html: highlightCode(line, language) || ' ',
                }}
              />
            </div>
          ))}
        </code>
      </pre>
    </div>
  );
}

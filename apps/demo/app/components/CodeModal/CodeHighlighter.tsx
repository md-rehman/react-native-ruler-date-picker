"use client";

import React from 'react';
import styles from './CodeModal.module.css';

interface CodeHighlighterProps {
  code: string;
}

export default function CodeHighlighter({ code }: CodeHighlighterProps) {
  const lines = code.trim().split('\n');

  return (
    <div className={styles.codeContainer}>
      <pre className={styles.pre}>
        <code>
          {lines.map((line, idx) => (
            <div key={idx} className={styles.line}>
              <span className={styles.lineNumber}>{idx + 1}</span>
              <span className={styles.lineContent}>
                {highlightLine(line)}
              </span>
            </div>
          ))}
        </code>
      </pre>
    </div>
  );
}

function highlightLine(line: string): React.ReactNode[] {
  if (!line) return [' '];

  const tokenRegex = /(\/\/.*$)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|(\b(?:import|export|default|function|const|return|from)\b)|(\b(?:React|useState|Date|View|StyleSheet|RulerDatePicker)\b)|(\b(?:true|false)\b)|(\b\d+\b)|(<\/?[\w-]+|\/?>)|(\b[a-zA-Z0-9_-]+(?==))|([{}()[\];,:=])/g;

  const elements: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = tokenRegex.exec(line)) !== null) {
    if (match.index > lastIndex) {
      elements.push(line.slice(lastIndex, match.index));
    }

    const [
      full,
      comment,
      str,
      keyword,
      component,
      boolean,
      num,
      tag,
      attr,
      punct,
    ] = match;

    const key = match.index;

    if (comment) {
      elements.push(<span key={key} className={styles.tokenComment}>{comment}</span>);
    } else if (str) {
      elements.push(<span key={key} className={styles.tokenString}>{str}</span>);
    } else if (keyword) {
      elements.push(<span key={key} className={styles.tokenKeyword}>{keyword}</span>);
    } else if (component) {
      elements.push(<span key={key} className={styles.tokenComponent}>{component}</span>);
    } else if (boolean) {
      elements.push(<span key={key} className={styles.tokenBoolean}>{boolean}</span>);
    } else if (num) {
      elements.push(<span key={key} className={styles.tokenNumber}>{num}</span>);
    } else if (tag) {
      elements.push(<span key={key} className={styles.tokenTag}>{tag}</span>);
    } else if (attr) {
      elements.push(<span key={key} className={styles.tokenAttr}>{attr}</span>);
    } else if (punct) {
      elements.push(<span key={key} className={styles.tokenPunct}>{punct}</span>);
    } else {
      elements.push(full);
    }

    lastIndex = tokenRegex.lastIndex;
  }

  if (lastIndex < line.length) {
    elements.push(line.slice(lastIndex));
  }

  return elements;
}

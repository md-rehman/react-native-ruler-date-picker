"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { getAdjacentPages } from '../../../data/docsNav';
import { highlightCode } from '../../../utils/highlightCode';
import { ExperimentalBadge } from '../ExperimentalBadge/ExperimentalBadge';
import styles from './DocElements.module.css';

// ── DocHeader ──
export interface DocHeaderProps {
  category: string;
  title: string;
  description: string;
  badge?: string;
  isExperimental?: boolean;
}

export function DocHeader({
  category,
  title,
  description,
  badge,
  isExperimental,
}: DocHeaderProps) {
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Documentation',
        item: 'https://md-rehman.dev/react-native-ruler-date-picker/docs/getting-started',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: category,
        item: 'https://md-rehman.dev/react-native-ruler-date-picker/docs/getting-started',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: title,
      },
    ],
  };

  return (
    <header className={styles.headerContainer}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className={styles.badgeRow}>
        <span className={styles.categoryBadge}>{category}</span>
        {badge && <span className={styles.tagBadge}>{badge}</span>}
        {isExperimental && (
          <ExperimentalBadge showText={true} size="md" />
        )}
      </div>
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.description}>{description}</p>
    </header>
  );
}

// ── Callout ──
export interface CalloutProps {
  type?: 'info' | 'tip' | 'warning';
  title?: string;
  children: React.ReactNode;
}

export function Callout({ type = 'info', title, children }: CalloutProps) {
  const typeClass =
    type === 'tip'
      ? styles.calloutTip
      : type === 'warning'
      ? styles.calloutWarning
      : styles.calloutInfo;

  return (
    <div className={`${styles.callout} ${typeClass}`}>
      <div className={styles.calloutIcon}>
        {type === 'tip' ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2v4"></path>
            <path d="m4.93 4.93 2.83 2.83"></path>
            <path d="M2 12h4"></path>
            <path d="m4.93 19.07 2.83-2.83"></path>
            <path d="M12 22v-4"></path>
            <path d="m19.07 19.07-2.83-2.83"></path>
            <path d="M22 12h-4"></path>
            <path d="m19.07 4.93-2.83 2.83"></path>
            <circle cx="12" cy="12" r="4"></circle>
          </svg>
        ) : type === 'warning' ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#007aff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
        )}
      </div>
      <div className={styles.calloutContent}>
        {title && <div style={{ fontWeight: 700, marginBottom: 4 }}>{title}</div>}
        {children}
      </div>
    </div>
  );
}

// ── CodeBlock ──
export interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
}

export function CodeBlock({ code, language = 'tsx', title }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <div className={styles.codeBlockContainer}>
      <div className={styles.codeBlockHeader}>
        <span className={styles.codeBlockTitle}>{title || language}</span>
        <button
          onClick={handleCopy}
          className={styles.copyBtn}
          title="Copy Code"
          aria-label="Copy Code"
        >
          {copied ? (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span style={{ color: '#22c55e' }}>Copied</span>
            </>
          ) : (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className={styles.codeContent}>
        <code
          className={`language-${language}`}
          dangerouslySetInnerHTML={{ __html: highlightCode(code, language) }}
        />
      </pre>
    </div>
  );
}

// ── PropsTable ──
export interface TableRow {
  name: string;
  type: string;
  default?: string;
  description: string;
  isExperimental?: boolean;
}

export interface PropsTableProps {
  data: TableRow[];
}

export function PropsTable({ data }: PropsTableProps) {
  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Prop</th>
            <th>Type</th>
            <th>Default</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.name}>
              <td className={styles.propName}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <span>{item.name}</span>
                  {item.isExperimental && <ExperimentalBadge size="sm" />}
                </div>
              </td>
              <td className={styles.propType}>{item.type}</td>
              <td>
                <code>{item.default && item.default !== 'undefined' ? item.default : '-'}</code>
              </td>
              <td>{item.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── DocPagination ──
export interface DocPaginationProps {
  currentHref: string;
}

export function DocPagination({ currentHref }: DocPaginationProps) {
  const { prev, next } = getAdjacentPages(currentHref);

  return (
    <nav className={styles.pagination} aria-label="Documentation Page Navigation">
      {prev ? (
        <Link href={prev.href} className={styles.paginationCard}>
          <span className={styles.paginationLabel}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
            Previous
          </span>
          <span className={styles.paginationTitle}>{prev.title}</span>
        </Link>
      ) : (
        <div />
      )}

      {next ? (
        <Link href={next.href} className={`${styles.paginationCard} ${styles.paginationNext}`}>
          <span className={styles.paginationLabel}>
            Next
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </span>
          <span className={styles.paginationTitle}>{next.title}</span>
        </Link>
      ) : (
        <div />
      )}
    </nav>
  );
}

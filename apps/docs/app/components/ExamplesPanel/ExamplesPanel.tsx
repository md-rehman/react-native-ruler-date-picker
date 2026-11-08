"use client";

import React, { useState } from 'react';
import { EXAMPLE_SECTIONS, ExamplePreset } from '../../../data/examples';
import ExampleListItem from '../ExampleListItem/ExampleListItem';
import { ExperimentalBadge } from '../ExperimentalBadge/ExperimentalBadge';
import styles from './ExamplesPanel.module.css';

interface ExamplesPanelProps {
  activeExampleId: string;
  onSelectExample: (preset: ExamplePreset) => void;
  onOpenCodeModal?: (presetId: string) => void;
}

export default function ExamplesPanel({
  activeExampleId,
  onSelectExample,
  onOpenCodeModal,
}: ExamplesPanelProps) {
  // All sections open by default (user preference)
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});

  const toggleSection = (sectionId: string) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  return (
    <div className={styles.container}>
      <div className={styles.list}>
        {EXAMPLE_SECTIONS.map((section) => {
          const isOpen = !collapsedSections[section.id];
          const hasActiveChild = section.items.some((item) => item.id === activeExampleId);

          return (
            <div key={section.id} className={styles.sectionGroup}>
              <button
                type="button"
                onClick={() => toggleSection(section.id)}
                className={styles.sectionHeader}
                aria-expanded={isOpen}
              >
                <div className={styles.sectionTitleRow}>
                  <span
                    className={styles.sectionTitle}
                    style={{ color: hasActiveChild ? 'var(--color-accent)' : undefined }}
                  >
                    {section.title}
                  </span>
                  {section.isExperimental ? (
                    <ExperimentalBadge size="sm" />
                  ) : section.badge ? (
                    <span className={styles.sectionBadge}>
                      {section.badge}
                    </span>
                  ) : null}
                </div>
                <svg
                  className={`${styles.sectionArrow} ${isOpen ? styles.sectionArrowOpen : ''}`}
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>

              {isOpen && (
                <div className={styles.sectionItems}>
                  {section.items.map((example) => (
                    <ExampleListItem
                      key={example.id}
                      example={example}
                      isActive={example.id === activeExampleId}
                      onClick={() => onSelectExample(example)}
                      onViewCode={onOpenCodeModal ? () => onOpenCodeModal(example.id) : undefined}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

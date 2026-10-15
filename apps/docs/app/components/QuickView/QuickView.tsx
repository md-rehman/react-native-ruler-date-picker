"use client";

import React from 'react';
import styles from './QuickView.module.css';

export interface QuickViewSection {
  id: string;
  title: string;
}

export const DOCS_SECTIONS: QuickViewSection[] = [
  { id: 'quick-start', title: 'Quick Start' },
  { id: 'installation', title: 'Installation' },
  { id: 'anatomy', title: 'Compound Anatomy' },
  { id: 'props', title: 'Component Props' },
  { id: 'theming', title: 'Theme Configuration' },
];

interface QuickViewProps {
  activeSection: string;
  onSelectSection: (id: string) => void;
  sections?: QuickViewSection[];
}

export default function QuickView({
  activeSection,
  onSelectSection,
  sections = DOCS_SECTIONS
}: QuickViewProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    onSelectSection(id);
    const el = document.getElementById(id);
    if (el) {
      const topOffset = 80;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - topOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      // Optionally update hash without jumping
      history.pushState(null, '', `#${id}`);
    }
  };

  return (
    <aside className={styles.container} aria-label="On This Page Navigation">
      <h4 className={styles.title}>On This Page</h4>
      <nav>
        <ul className={styles.list}>
          {sections.map((section) => {
            const isActive = activeSection === section.id;
            return (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  onClick={(e) => handleClick(e, section.id)}
                  className={`${styles.link} ${isActive ? styles.linkActive : ''}`}
                  aria-current={isActive ? 'location' : undefined}
                >
                  {section.title}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}

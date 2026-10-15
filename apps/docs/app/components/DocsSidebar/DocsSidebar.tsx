"use client";

import React from 'react';
import Link from 'next/link';
import styles from './DocsSidebar.module.css';

export interface DocNavItem {
  id: string;
  name: string;
  badge: string;
  desc: string;
  href: string;
  isExternal?: boolean;
}

export const DOCS_NAV_ITEMS: DocNavItem[] = [
  {
    id: 'quick-start',
    name: 'Quick Start',
    badge: '<> Code',
    desc: 'Minimal setup example & React state binding',
    href: '#quick-start'
  },
  {
    id: 'installation',
    name: 'Installation',
    badge: '#setup',
    desc: 'Package install & Reanimated 3 peer dependencies',
    href: '#installation'
  },
  {
    id: 'anatomy',
    name: 'Compound Anatomy',
    badge: '#compound',
    desc: 'Root, Track, Needle & Ticks breakdown',
    href: '#anatomy'
  },
  {
    id: 'props',
    name: 'Component Props',
    badge: '#api',
    desc: 'Complete props table, types & defaults',
    href: '#props'
  },
  {
    id: 'theming',
    name: 'Theme Configuration',
    badge: '#theming',
    desc: 'Appearance tokens, custom colors & dark mode',
    href: '#theming'
  },
  {
    id: 'playground',
    name: 'Interactive Playground',
    badge: '⚡ Live',
    desc: 'Live device simulators & preset sandbox',
    href: '/playground',
    isExternal: true
  }
];

interface DocsSidebarProps {
  activeSection: string;
  onSelectSection: (id: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export default function DocsSidebar({
  activeSection,
  onSelectSection,
  isCollapsed,
  onToggleCollapse
}: DocsSidebarProps) {
  return (
    <>
      {isCollapsed && (
        <button
          id="docs-sidebar-dock-tab"
          className={styles.dockTab}
          onClick={onToggleCollapse}
          title="Restore Documentation Menu"
          aria-label="Expand Documentation Sidebar"
        >
          <svg
            className={styles.dockIcon}
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
          <span className={styles.dockTitle}>Documentation</span>
        </button>
      )}

      <aside
        className={`${styles.sidebarWrapper} ${isCollapsed ? styles.sidebarWrapperCollapsed : ''}`}
        aria-label="Documentation Navigation"
        aria-hidden={isCollapsed}
      >
        <div className={styles.card}>
          <div className={styles.header}>
            <div className={styles.titleWrapper}>
              <span className={styles.title}>DOCUMENTATION</span>
            </div>
            <button
              id="docs-sidebar-collapse-btn"
              onClick={onToggleCollapse}
              className={styles.iconBtn}
              title="Collapse Sidebar"
              aria-label="Collapse Sidebar"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
          </div>

          <nav className={styles.list}>
            {DOCS_NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;

              if (item.isExternal) {
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={`${styles.item} ${isActive ? styles.itemActive : ''}`}
                  >
                    <div className={styles.itemHeader}>
                      <span className={styles.itemName}>{item.name}</span>
                      <span className={styles.itemBadge}>{item.badge}</span>
                    </div>
                    <p className={styles.itemDesc}>{item.desc}</p>
                  </Link>
                );
              }

              return (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    onSelectSection(item.id);
                    const el = document.getElementById(item.id);
                    if (el) {
                      const topOffset = 80;
                      const elementPosition = el.getBoundingClientRect().top;
                      const offsetPosition = elementPosition + window.pageYOffset - topOffset;
                      window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                      });
                    }
                  }}
                  className={`${styles.item} ${isActive ? styles.itemActive : ''}`}
                >
                  <div className={styles.itemHeader}>
                    <span className={styles.itemName}>{item.name}</span>
                    <span className={styles.itemBadge}>{item.badge}</span>
                  </div>
                  <p className={styles.itemDesc}>{item.desc}</p>
                </a>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
}

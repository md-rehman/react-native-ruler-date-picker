"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { DOCS_NAV_SECTIONS } from '../../../data/docsNav';
import styles from './DocsSidebar.module.css';

interface DocsSidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export default function DocsSidebar({
  isCollapsed,
  onToggleCollapse,
}: DocsSidebarProps) {
  const pathname = usePathname();

  // Keep track of collapsed sections (all open by default)
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});

  const toggleSection = (sectionId: string) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

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
            {DOCS_NAV_SECTIONS.map((section) => {
              const isOpen = !collapsedSections[section.id];
              const hasActiveChild = section.items.some((item) => pathname === item.href);

              return (
                <div key={section.id} className={styles.sectionGroup}>
                  <button
                    type="button"
                    onClick={() => toggleSection(section.id)}
                    className={styles.sectionHeader}
                    aria-expanded={isOpen}
                  >
                    <span
                      className={styles.sectionTitle}
                      style={{ color: hasActiveChild ? 'var(--color-accent)' : undefined }}
                    >
                      {section.title}
                    </span>
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
                      {section.items.map((item) => {
                        const isActive = pathname === item.href;

                        return (
                          <Link
                            key={item.id}
                            href={item.href}
                            className={`${styles.item} ${isActive ? styles.itemActive : ''}`}
                          >
                            <div className={styles.itemHeader}>
                              <span className={styles.itemName}>{item.title}</span>
                              {item.badge && (
                                <span className={styles.itemBadge}>{item.badge}</span>
                              )}
                            </div>
                            {item.desc && (
                              <p className={styles.itemDesc}>{item.desc}</p>
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          <div className={styles.sidebarFooter}>
            <Link href="/playground" className={styles.playgroundLink}>
              <span>Interactive Playground</span>
              <span className={styles.itemBadge} style={{ color: 'var(--color-accent)', borderColor: 'var(--color-accent)' }}>⚡ Live</span>
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}

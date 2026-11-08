"use client";

import React, { useState, useEffect } from 'react';
import TopBar from '../components/TopBar/TopBar';
import DocsSidebar from '../components/DocsSidebar/DocsSidebar';
import Footer from '../components/Footer/Footer';
import styles from './docs.module.css';

export default function DocsLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('docs-sidebar-collapsed');
    if (stored !== null) {
      setIsSidebarCollapsed(stored === 'true');
    }
  }, []);

  const handleToggleCollapse = () => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('docs-sidebar-collapsed', String(next));
      return next;
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.gridBackground} />
      <TopBar />

      <div className={`${styles.layout} ${isSidebarCollapsed ? styles.layoutCollapsed : ''}`}>
        <DocsSidebar
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={handleToggleCollapse}
        />

        <main className={styles.content}>
          {children}
        </main>
      </div>

      <Footer />
    </div>
  );
}

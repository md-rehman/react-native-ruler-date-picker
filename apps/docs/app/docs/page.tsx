"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import TopBar from '../components/TopBar/TopBar';
import Footer from '../components/Footer/Footer';
import { PROP_DEFINITIONS } from '../../data/propDefinitions';
import styles from './docs.module.css';

export default function DocsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Selection', 'Dimensions', 'Colors', 'Features'];

  const filteredProps = selectedCategory === 'All' 
    ? PROP_DEFINITIONS 
    : PROP_DEFINITIONS.filter((p) => p.category === selectedCategory);

  return (
    <div className={styles.container}>
      <TopBar />

      <div className={styles.layout}>
        {/* ── Sidebar ── */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarGroup}>
            <span className={styles.sidebarTitle}>Overview</span>
            <a href="#quick-start" className={styles.sidebarLink}>Quick Start</a>
            <a href="#installation" className={styles.sidebarLink}>Installation</a>
            <a href="#anatomy" className={styles.sidebarLink}>Compound Anatomy</a>
          </div>

          <div className={styles.sidebarGroup}>
            <span className={styles.sidebarTitle}>API Reference</span>
            <a href="#props" className={styles.sidebarLink}>Props Table</a>
            <a href="#theming" className={styles.sidebarLink}>Theme Configuration</a>
          </div>

          <div className={styles.sidebarGroup}>
            <span className={styles.sidebarTitle}>Interactive</span>
            <Link href="/playground" className={styles.sidebarLink}>Launch Playground →</Link>
          </div>
        </aside>

        {/* ── Main Content ── */}
        <main className={styles.content}>
          <div className={styles.comingSoonBanner}>
            <div className={styles.bannerText}>
              <div className={styles.bannerTitle}>
                <span>📚 Documentation Center</span>
              </div>
              <p className={styles.bannerDesc}>
                Full interactive guides, recipes, and video walkthroughs are actively being added. Explore all props interactively right now in our live Playground!
              </p>
            </div>
            <Link href="/playground" className={styles.bannerBtn}>
              Go to Playground →
            </Link>
          </div>

          {/* Quick Start */}
          <section id="quick-start" className={styles.docSection}>
            <h2 className={styles.sectionTitle}>Quick Start</h2>
            <p className={styles.sectionLead}>
              Import <code>RulerDatePicker</code> and hook it up to your React state in just a few lines of code.
            </p>
            <pre className={styles.codeBlock}>
              <code>{`import React, { useState } from 'react';
import { RulerDatePicker } from 'react-native-ruler-date-picker';

export default function MyCalendar() {
  const [date, setDate] = useState(new Date());

  return (
    <RulerDatePicker
      value={date}
      onChange={(selectedDate, dateString) => {
        setDate(selectedDate);
        console.log('Selected date:', dateString); // e.g. "2026-08-07"
      }}
      showResetToToday
    />
  );
}`}</code>
            </pre>
          </section>

          {/* Installation */}
          <section id="installation" className={styles.docSection}>
            <h2 className={styles.sectionTitle}>Installation & Peer Dependencies</h2>
            <p className={styles.sectionLead}>
              Add the package and ensure Reanimated 3 and Gesture Handler are configured in your project.
            </p>
            <pre className={styles.codeBlock}>
              <code>{`# Package installation
npm install react-native-ruler-date-picker

# Peer dependencies
npm install react-native-reanimated react-native-gesture-handler

# Optional (for tactile haptic feedback in Expo)
npx expo install expo-haptics`}</code>
            </pre>
          </section>

          {/* Props Table */}
          <section id="props" className={styles.docSection}>
            <h2 className={styles.sectionTitle}>Component Props Reference</h2>
            <p className={styles.sectionLead}>
              Complete configuration options supported by <code>&lt;RulerDatePicker /&gt;</code>.
            </p>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 'var(--radius-xl)',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    background: selectedCategory === cat ? 'var(--color-accent)' : 'var(--color-surface)',
                    color: selectedCategory === cat ? '#FFFFFF' : 'var(--color-text-secondary)',
                    border: '1px solid var(--glass-border)',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className={styles.tableWrapper}>
              <table className={styles.propsTable}>
                <thead>
                  <tr>
                    <th>Prop</th>
                    <th>Type</th>
                    <th>Default</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProps.map((prop) => (
                    <tr key={prop.name}>
                      <td className={styles.propName}>{prop.name}</td>
                      <td className={styles.propType}>{prop.type}</td>
                      <td>
                        <code>{prop.defaultValue !== undefined && prop.defaultValue !== '' ? String(prop.defaultValue) : '—'}</code>
                      </td>
                      <td>{prop.description || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>

      <Footer />
    </div>
  );
}

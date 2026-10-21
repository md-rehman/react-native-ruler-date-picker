"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import TopBar from '../components/TopBar/TopBar';
import DocsSidebar from '../components/DocsSidebar/DocsSidebar';
import QuickView from '../components/QuickView/QuickView';
import Footer from '../components/Footer/Footer';
import { PROP_DEFINITIONS } from '../../data/propDefinitions';
import styles from './docs.module.css';

const ANATOMY_COMPONENTS = [
  {
    tag: '<Ruler.Root>',
    name: 'State Provider & Gesture Controller',
    desc: 'Houses Reanimated 3 shared values, gesture handlers, inertial decay physics, and date synchronization context.',
  },
  {
    tag: '<Ruler.Header>',
    name: 'Formatted Live Header',
    desc: 'Displays the currently active date, month, year, or custom label formatters with optional jump-to-today action.',
  },
  {
    tag: '<Ruler.Track>',
    name: 'Viewport & Gesture Arena',
    desc: 'Constrains the graduation track, applies overflow clipping, and orchestrates horizontal pan gesture interactions.',
  },
  {
    tag: '<Ruler.Indicator>',
    name: 'Center Alignment Needle',
    desc: 'Fixed center cursor needle with customizable width, height, corner radius, color, or a custom React component.',
  },
  {
    tag: '<Ruler.Ticks>',
    name: 'Windowed Virtualized Graduations',
    desc: 'Efficiently calculates and renders only visible graduation marks + configurable buffer ticks for optimal 60 FPS frame rates.',
  },
  {
    tag: '<Ruler.ResetButton>',
    name: 'Today / Reset Action',
    desc: 'Context-aware reset button that automatically appears when scrolled away from today or the initial date.',
  },
  {
    tag: '<RulerRange.*>',
    name: 'Range Selection Compound Anatomy',
    desc: 'Dedicated compound system featuring Root, Track, Highlight band, and Header for selecting fluid date spans.',
  },
];

const THEME_TOKENS = [
  { token: 'backgroundColor', type: 'string', default: "'transparent'", desc: 'Background color of the ruler viewport track' },
  { token: 'indicatorColor', type: 'string', default: "'#0A84FF'", desc: 'Primary color of the center graduation needle' },
  { token: 'accentColor', type: 'string', default: "'#0A84FF'", desc: 'Highlight tint for active marks, headers & selection' },
  { token: 'defaultTickColor', type: 'string', default: "'#8E8E93'", desc: 'Default color of standard graduation ticks' },
  { token: 'labelColor', type: 'string', default: "'#1D1D1F'", desc: 'Text color for date numbers, month headers and tick labels' },
  { token: 'rangeHighlightColor', type: 'string', default: "'rgba(10, 132, 255, 0.25)'", desc: 'Tint color for selected interval highlight band' },
];

export default function DocsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState('quick-start');

  const categories = ['All', 'Selection', 'Dimensions', 'Colors', 'Features'];

  const filteredProps = selectedCategory === 'All'
    ? PROP_DEFINITIONS
    : PROP_DEFINITIONS.filter((p) => p.category === selectedCategory);

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

  useEffect(() => {
    const handleScroll = () => {
      const sectionIds = ['quick-start', 'installation', 'anatomy', 'props', 'theming'];
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 80) {
        setActiveSection(sectionIds[sectionIds.length - 1]);
        return;
      }

      const scrollY = window.scrollY + 140;
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const id = sectionIds[i];
        const el = document.getElementById(id);
        if (el && scrollY >= el.offsetTop) {
          setActiveSection(id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.gridBackground} />
      <TopBar />

      <div className={`${styles.layout} ${isSidebarCollapsed ? styles.layoutCollapsed : ''}`}>
        <DocsSidebar
          activeSection={activeSection}
          onSelectSection={setActiveSection}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={handleToggleCollapse}
        />

        {/* ── Main Full-Width Content ── */}
        <main className={styles.content}>
          <div className={styles.comingSoonBanner}>
            <div className={styles.bannerText}>
              <div className={styles.bannerTitle}>
                <span>📚 Documentation & API Reference</span>
              </div>
              <p className={styles.bannerDesc}>
                Everything you need to integrate and customize <code>react-native-ruler-date-picker</code> in Expo and bare React Native projects.
              </p>
            </div>
            <Link href="/playground" className={styles.bannerBtn}>
              Launch Playground →
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
      ticks="calendar"
      header={{ showResetToToday: true }}
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

          {/* Compound Anatomy */}
          <section id="anatomy" className={styles.docSection}>
            <h2 className={styles.sectionTitle}>Compound Anatomy</h2>
            <p className={styles.sectionLead}>
              Build bespoke ruler layouts with granular sub-components or compose custom headers and indicators.
            </p>
            <div className={styles.anatomyGrid}>
              {ANATOMY_COMPONENTS.map((item) => (
                <div key={item.tag} className={styles.anatomyCard}>
                  <span className={styles.anatomyTag}>{item.tag}</span>
                  <span className={styles.anatomyName}>{item.name}</span>
                  <p className={styles.anatomyDesc}>{item.desc}</p>
                </div>
              ))}
            </div>
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

          {/* Theming */}
          <section id="theming" className={styles.docSection}>
            <h2 className={styles.sectionTitle}>Theme Configuration</h2>
            <p className={styles.sectionLead}>
              Pass a <code>theme</code> object to customize the colors of the needle indicator, track ticks, text, and active highlights.
            </p>
            <div className={styles.tableWrapper}>
              <table className={styles.propsTable}>
                <thead>
                  <tr>
                    <th>Token</th>
                    <th>Type</th>
                    <th>Default</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {THEME_TOKENS.map((item) => (
                    <tr key={item.token}>
                      <td className={styles.propName}>{item.token}</td>
                      <td className={styles.propType}>{item.type}</td>
                      <td><code>{item.default}</code></td>
                      <td>{item.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </main>

        <QuickView
          activeSection={activeSection}
          onSelectSection={setActiveSection}
        />
      </div>

      <Footer />
    </div>
  );
}

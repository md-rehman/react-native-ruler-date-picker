"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import styles from './page.module.css';

const HeroDemo = dynamic(
  () => import('./components/HeroDemo/HeroDemo'),
  { 
    ssr: false,
    loading: () => (
      <div style={{ height: 280, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)' }}>
        Loading interactive preview...
      </div>
    )
  }
);

const ANATOMY_ITEMS = [
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

const CODE_EXAMPLES = {
  simple: `import React, { useState } from 'react';
import { RulerDatePicker } from 'react-native-ruler-date-picker';

export default function AppointmentPicker() {
  const [date, setDate] = useState(new Date());

  return (
    <RulerDatePicker
      value={date}
      onChange={(newDate, str) => {
        setDate(newDate);
        console.log('Selected date:', str);
      }}
      ticks="calendar"
      showResetToToday
      enableHaptics
      theme={{
        indicatorColor: '#38BDF8',
        accentColor: '#38BDF8',
      }}
    />
  );
}`,
  compound: `import React, { useState } from 'react';
import { Ruler } from 'react-native-ruler-date-picker';

export default function CustomRulerLayout() {
  const [date, setDate] = useState(new Date());

  return (
    <Ruler.Root value={date} onChange={setDate} ticks="calendar">
      <Ruler.Header />
      <Ruler.Track>
        <Ruler.Indicator />
        <Ruler.Ticks />
      </Ruler.Track>
      <Ruler.ResetButton label="Jump to Today" />
    </Ruler.Root>
  );
}`,
  range: `import React, { useState } from 'react';
import { RulerRange } from 'react-native-ruler-date-picker';

export default function VacationRangePicker() {
  const [range, setRange] = useState({
    startDate: new Date('2026-07-01'),
    endDate: new Date('2026-07-15'),
  });

  return (
    <RulerRange.Root value={range} onChange={setRange}>
      <RulerRange.Header />
      <RulerRange.Track>
        <RulerRange.Highlight color="rgba(56, 189, 248, 0.25)" />
      </RulerRange.Track>
    </RulerRange.Root>
  );
}`,
};

export default function HomePage() {
  const [copiedInstall, setCopiedInstall] = useState(false);
  const [activeCodeTab, setActiveCodeTab] = useState<'simple' | 'compound' | 'range'>('simple');
  const [copiedCode, setCopiedCode] = useState(false);
  const [activePm, setActivePm] = useState<'pnpm' | 'npm' | 'yarn' | 'bun'>('npm');

  const installCommand = 
    activePm === 'pnpm' ? 'pnpm add react-native-ruler-date-picker' :
    activePm === 'yarn' ? 'yarn add react-native-ruler-date-picker' :
    activePm === 'bun' ? 'bun add react-native-ruler-date-picker' :
    'npm install react-native-ruler-date-picker';

  const handleCopyInstall = () => {
    navigator.clipboard.writeText(installCommand);
    setCopiedInstall(true);
    setTimeout(() => setCopiedInstall(false), 2000);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(CODE_EXAMPLES[activeCodeTab]);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className={styles.page}>
      <div className={styles.glowTop} />
      <div className={styles.glowAccent} />

      <Navbar />

      <main className={styles.mainContent}>
        {/* ── HERO SECTION ── */}
        <section className={styles.hero}>
          <div className={styles.badge}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
            <span>60 FPS Reanimated 3 • Dual-Speed Haptics • Compound Anatomy</span>
          </div>

          <h1 className={styles.headline}>
            The Horizontal Ruler Date Picker <br />
            <span className={styles.gradientText}>Engineered for Fluid Mobile UX</span>
          </h1>

          <p className={styles.subheadline}>
            A high-performance horizontal ruler date picker & scroll wheel for React Native and Expo.
            Decay physics, virtualized graduations, adaptive haptics, and compound component freedom.
          </p>

          <div className={styles.ctaGroup}>
            <Link href="/playground" className={styles.primaryCta}>
              <span>Explore Playground</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Link>

            <Link href="/docs" className={styles.secondaryCta}>
              <span>Documentation</span>
            </Link>

            <button 
              className={styles.installPill} 
              onClick={handleCopyInstall}
              title="Copy installation command"
            >
              <svg className={styles.installPillIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
              <code>npm i react-native-ruler-date-picker</code>
              <span className={styles.copyLabel}>{copiedInstall ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>

          <div className={styles.heroDemoContainer}>
            <HeroDemo />
          </div>
        </section>

        {/* ── FEATURES GRID ── */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>Built for Performance</span>
            <h2 className={styles.sectionTitle}>Everything You Need in a Ruler Picker</h2>
            <p className={styles.sectionSubtitle}>
              Crafted from scratch to eliminate dropped frames, erratic scroll jumps, and rigid layouts.
            </p>
          </div>

          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIconWrapper}>🚀</div>
              <h3 className={styles.featureTitle}>60 FPS Reanimated 3 Physics</h3>
              <p className={styles.featureDesc}>
                Inertial velocity deceleration, smooth decay animations, and magnetic snap-to-tick alignment execute on the native UI thread without JS bridge traffic.
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIconWrapper}>📳</div>
              <h3 className={styles.featureTitle}>Dual-Speed Tactile Haptics</h3>
              <p className={styles.featureDesc}>
                Micro-click feedback during delicate, slow fine-tuning and continuous sensory vibrations during high-velocity fling swipes (supports `expo-haptics`).
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIconWrapper}>🪟</div>
              <h3 className={styles.featureTitle}>Windowed Virtualized Rendering</h3>
              <p className={styles.featureDesc}>
                Only renders visible graduations plus a configurable buffer (`bufferTicks`), ensuring constant 60 FPS performance and zero memory bloat across infinite dates.
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIconWrapper}>📏</div>
              <h3 className={styles.featureTitle}>Multi-Tier Rule-Based Graduations</h3>
              <p className={styles.featureDesc}>
                Built-in graduation styles (`'calendar'`, `'metric'`, `'minimal'`) or declarative rule arrays for custom heights, widths, colors, and date label formatters.
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIconWrapper}>🧩</div>
              <h3 className={styles.featureTitle}>Compound Anatomy Architecture</h3>
              <p className={styles.featureDesc}>
                Complete structural control via <code>Ruler.Root</code>, <code>Ruler.Header</code>, <code>Ruler.Track</code>, <code>Ruler.Indicator</code>, and <code>Ruler.Ticks</code>—or drop in <code>&lt;RulerDatePicker /&gt;</code> for one-line simplicity.
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIconWrapper}>🌓</div>
              <h3 className={styles.featureTitle}>Adaptive Cupertino Theming</h3>
              <p className={styles.featureDesc}>
                Auto-detects device light & dark appearance with full custom theme token overrides for indicator needles, tick bars, text, and track backgrounds.
              </p>
            </div>
          </div>
        </section>

        {/* ── PACKAGE ANATOMY ── */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>Architecture</span>
            <h2 className={styles.sectionTitle}>The Anatomy of the Package</h2>
            <p className={styles.sectionSubtitle}>
              Whether you need instant drop-in convenience or custom UI composition, our compound architecture gives you total control.
            </p>
          </div>

          <div className={styles.anatomyContainer}>
            <div className={styles.anatomyBreakdown}>
              {ANATOMY_ITEMS.map((item) => (
                <div key={item.tag} className={styles.anatomyItem}>
                  <span className={styles.anatomyTag}>{item.tag}</span>
                  <div className={styles.anatomyContent}>
                    <span className={styles.anatomyName}>{item.name}</span>
                    <p className={styles.anatomyDesc}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.codeBox}>
              <div className={styles.codeBoxHeader}>
                <div className={styles.codeBoxTabs}>
                  <button 
                    onClick={() => setActiveCodeTab('simple')} 
                    className={`${styles.codeTab} ${activeCodeTab === 'simple' ? styles.codeTabActive : ''}`}
                  >
                    Simple Drop-in
                  </button>
                  <button 
                    onClick={() => setActiveCodeTab('compound')} 
                    className={`${styles.codeTab} ${activeCodeTab === 'compound' ? styles.codeTabActive : ''}`}
                  >
                    Compound Anatomy
                  </button>
                  <button 
                    onClick={() => setActiveCodeTab('range')} 
                    className={`${styles.codeTab} ${activeCodeTab === 'range' ? styles.codeTabActive : ''}`}
                  >
                    Date Range Picker
                  </button>
                </div>

                <button onClick={handleCopyCode} className={styles.copyCodeBtn}>
                  {copiedCode ? 'Copied!' : 'Copy Code'}
                </button>
              </div>

              <pre className={styles.codeContent}>
                <code>{CODE_EXAMPLES[activeCodeTab]}</code>
              </pre>
            </div>
          </div>
        </section>

        {/* ── INSTALLATION SECTION ── */}
        <section className={styles.section}>
          <div className={styles.installSection}>
            <div className={styles.sectionHeader} style={{ alignItems: 'flex-start', textAlign: 'left' }}>
              <span className={styles.sectionTag}>Get Started</span>
              <h2 className={styles.sectionTitle}>Install in Seconds</h2>
              <p className={styles.sectionSubtitle} style={{ margin: 0 }}>
                Compatible with React Native 0.70+, Expo SDK 49+, and React Native Web.
              </p>
            </div>

            <div className={styles.pmSwitcher}>
              {(['npm', 'pnpm', 'yarn', 'bun'] as const).map((pm) => (
                <button
                  key={pm}
                  onClick={() => setActivePm(pm)}
                  className={`${styles.pmBtn} ${activePm === pm ? styles.pmBtnActive : ''}`}
                >
                  {pm}
                </button>
              ))}
            </div>

            <div className={styles.terminalBlock}>
              <div className={styles.terminalCommand}>
                <span className={styles.terminalPrompt}>$</span>
                <span>{installCommand}</span>
              </div>
              <button 
                onClick={handleCopyInstall} 
                className={styles.copyCodeBtn}
                title="Copy command"
              >
                {copiedInstall ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        </section>

        {/* ── CTA BANNER ── */}
        <section className={styles.section}>
          <div className={styles.banner}>
            <h2 className={styles.bannerTitle}>Experience the Ruler in Action</h2>
            <p className={styles.bannerSubtitle}>
              Test presets, inspect the live property controls, simulate devices, and copy ready-to-use code in our interactive playground.
            </p>
            <div className={styles.ctaGroup}>
              <Link href="/playground" className={styles.primaryCta}>
                Launch Interactive Playground
              </Link>
              <Link href="/docs" className={styles.secondaryCta}>
                View API Docs
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

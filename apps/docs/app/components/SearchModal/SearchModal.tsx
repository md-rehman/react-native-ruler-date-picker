"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { PROP_DEFINITIONS, PropDefinition } from '../../../data/propDefinitions';
import styles from './SearchModal.module.css';

export interface SearchItem {
  id: string;
  title: string;
  desc: string;
  category: 'Section' | 'Component' | 'Prop' | 'Theming' | 'Navigation';
  href: string;
  keywords?: string[];
}

const STATIC_SEARCH_ITEMS: SearchItem[] = [
  // Getting Started & Introduction
  {
    id: 'sec-getting-started',
    title: 'Getting Started',
    desc: 'Installation, peer dependencies, babel setup & quick start',
    category: 'Section',
    href: '/docs/getting-started',
    keywords: ['start', 'intro', 'example', 'install', 'setup', 'babel', 'expo', 'dependencies']
  },
  {
    id: 'sec-primitives',
    title: 'Primitives (Ticks & LensTicks)',
    desc: 'Graduation marks, virtual windowing & declarative rule evaluation',
    category: 'Section',
    href: '/docs/introduction/primitives',
    keywords: ['primitives', 'ticks', 'lens', 'windowing', 'rule', 'resolver', 'virtualized']
  },
  {
    id: 'sec-haptics',
    title: 'Haptic Feedback',
    desc: 'Dual-speed tactile engine, velocity thresholds & Expo Haptics',
    category: 'Section',
    href: '/docs/introduction/haptics',
    keywords: ['haptics', 'tactile', 'vibration', 'buzz', 'expo', 'taptic', 'feedback']
  },
  {
    id: 'sec-theming',
    title: 'Theming & Appearance',
    desc: 'Color tokens, automatic dark/light mode & useResolvedTheme',
    category: 'Theming',
    href: '/docs/introduction/theming',
    keywords: ['theme', 'colors', 'appearance', 'dark', 'light', 'customization', 'accent']
  },
  {
    id: 'sec-playground',
    title: 'Interactive Playground',
    desc: 'Live iOS & Android device simulators with customizable controls',
    category: 'Navigation',
    href: '/playground',
    keywords: ['playground', 'simulator', 'demo', 'sandbox', 'live', 'device', 'interactive']
  },

  // RulerDatePicker (Single Date)
  {
    id: 'sec-rdp-basic',
    title: 'RulerDatePicker - Basic Usage',
    desc: 'Turnkey single-date picker with controlled state and boundaries',
    category: 'Component',
    href: '/docs/ruler-date-picker/basic',
    keywords: ['single', 'date', 'picker', 'ruler', 'basic', 'controlled', 'value']
  },
  {
    id: 'sec-rdp-anatomy',
    title: 'RulerDatePicker - Compound Anatomy',
    desc: 'Modular subcomponents: Ruler.Root, Track, Indicator, Ticks, Header & Reset',
    category: 'Component',
    href: '/docs/ruler-date-picker/anatomy',
    keywords: ['anatomy', 'compound', 'modular', 'root', 'track', 'indicator', 'ticks', 'reset']
  },
  {
    id: 'sec-rdp-lens',
    title: 'Lens Distortion Effect',
    desc: 'Fisheye optical magnification & non-linear tick spacing',
    category: 'Component',
    href: '/docs/ruler-date-picker/lens-effect',
    keywords: ['lens', 'fisheye', 'distortion', 'magnification', 'loupe', 'optical']
  },
  {
    id: 'sec-rdp-api',
    title: 'RulerDatePicker - API Reference',
    desc: 'Complete configuration table, prop types, defaults & descriptions',
    category: 'Section',
    href: '/docs/ruler-date-picker/api',
    keywords: ['props', 'api', 'types', 'options', 'parameters', 'reference', 'table']
  },

  // RulerDateRangePicker (Range)
  {
    id: 'sec-rdrp-basic',
    title: 'RulerDateRangePicker - Basic Usage',
    desc: 'Dual handles, span boundaries, and range state management',
    category: 'Component',
    href: '/docs/ruler-date-range-picker/basic',
    keywords: ['range', 'date-range', 'interval', 'dual', 'handles', 'span', 'booking']
  },
  {
    id: 'sec-rdrp-anatomy',
    title: 'RulerDateRangePicker - Compound Anatomy',
    desc: 'RulerRange.Root, Track, Indicator, Highlight & Range Header',
    category: 'Component',
    href: '/docs/ruler-date-range-picker/anatomy',
    keywords: ['range', 'anatomy', 'highlight', 'handles', 'compound']
  },
  {
    id: 'sec-rdrp-api',
    title: 'RulerDateRangePicker - API Reference',
    desc: 'DateRange types, minSpanDays, maxSpanDays & range props table',
    category: 'Section',
    href: '/docs/ruler-date-range-picker/api',
    keywords: ['range', 'api', 'props', 'types', 'dateRange']
  },

  // Headless Hooks
  {
    id: 'hook-use-ruler-date-picker',
    title: 'useRulerDatePicker',
    desc: 'Headless single-date physics, Reanimated 3 decay, snapping & windowing',
    category: 'Component',
    href: '/docs/hooks/use-ruler-date-picker',
    keywords: ['hook', 'headless', 'decay', 'reanimated', 'snapping', 'scrollX']
  },
  {
    id: 'hook-use-ruler-date-range-picker',
    title: 'useRulerDateRangePicker',
    desc: 'Headless range physics, dual-handle shared values & collision clamping',
    category: 'Component',
    href: '/docs/hooks/use-ruler-date-range-picker',
    keywords: ['hook', 'range', 'handles', 'clamping', 'headless']
  },
  {
    id: 'hook-contexts',
    title: 'Compound Contexts (useRulerContext & useRulerRangeContext)',
    desc: 'Access internal Reanimated shared values in custom compound children',
    category: 'Component',
    href: '/docs/hooks/contexts',
    keywords: ['context', 'useRulerContext', 'useRulerRangeContext', 'children']
  },
  {
    id: 'hook-utility-hooks',
    title: 'Utility Hooks & Date Helpers',
    desc: 'useHaptics, useResolvedTheme, formatDateString & DST calendar math',
    category: 'Component',
    href: '/docs/hooks/utility-hooks',
    keywords: ['utils', 'helpers', 'formatDateString', 'normalizeDate', 'timezone', 'dst']
  },
];

// Add props dynamically from prop definitions
const SEARCH_INDEX: SearchItem[] = [
  ...STATIC_SEARCH_ITEMS,
  ...PROP_DEFINITIONS.map((prop: PropDefinition) => ({
    id: `prop-${prop.name}`,
    title: `${prop.name}`,
    desc: `${prop.type} — ${prop.description || 'Configurable ruler property'}`,
    category: 'Prop' as const,
    href: '/docs/ruler-date-picker/api',
    keywords: ['prop', prop.name, prop.type, prop.category || '']
  }))
];

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Filter items
  const filteredItems = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) {
      // Default initial view: show featured sections and components
      return SEARCH_INDEX.slice(0, 10);
    }

    return SEARCH_INDEX.filter((item) => {
      const matchTitle = item.title.toLowerCase().includes(trimmed);
      const matchDesc = item.desc.toLowerCase().includes(trimmed);
      const matchCategory = item.category.toLowerCase().includes(trimmed);
      const matchKeywords = item.keywords?.some((k) => k.toLowerCase().includes(trimmed));
      return matchTitle || matchDesc || matchCategory || matchKeywords;
    });
  }, [query]);

  // Reset selected index when items change
  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredItems]);

  const handleSelect = (item: SearchItem) => {
    onClose();

    if (item.href.startsWith('/docs#')) {
      const anchorId = item.href.replace('/docs#', '');
      if (pathname === '/docs') {
        const el = document.getElementById(anchorId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          history.pushState(null, '', `#${anchorId}`);
          return;
        }
      }
    }

    router.push(item.href);
  };

  // Keyboard navigation inside modal
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < filteredItems.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredItems.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        handleSelect(filteredItems[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  // Scroll active item into view
  useEffect(() => {
    if (!resultsRef.current) return;
    const activeEl = resultsRef.current.children[selectedIndex] as HTMLElement;
    if (activeEl) {
      activeEl.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  return (
    <div
      className={styles.backdrop}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      aria-modal="true"
      role="dialog"
    >
      <div className={styles.modal} onKeyDown={handleKeyDown}>
        {/* Top Input Bar */}
        <div className={styles.inputWrapper}>
          <svg
            className={styles.searchIcon}
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
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>

          <input
            ref={inputRef}
            type="text"
            className={styles.input}
            placeholder="Search documentation, props, components..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          {query && (
            <button
              className={styles.clearButton}
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              title="Clear search"
              aria-label="Clear search"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          )}

          <span className={styles.escBadge}>ESC</span>
        </div>

        {/* Results List */}
        <div ref={resultsRef} className={styles.resultsList}>
          {filteredItems.length === 0 ? (
            <div className={styles.emptyState}>
              <p>No results found for &ldquo;<strong>{query}</strong>&rdquo;</p>
              <span>Try searching for props like &ldquo;ticks&rdquo;, &ldquo;theme&rdquo;, or &ldquo;haptics&rdquo;.</span>
            </div>
          ) : (
            filteredItems.map((item, index) => {
              const isSelected = index === selectedIndex;
              const badgeClass = 
                item.category === 'Section' ? styles.badgeSection :
                item.category === 'Component' ? styles.badgeComponent :
                item.category === 'Prop' ? styles.badgeProp :
                item.category === 'Theming' ? styles.badgeTheming : '';

              return (
                <button
                  key={item.id}
                  className={`${styles.resultItem} ${isSelected ? styles.resultItemSelected : ''}`}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <div className={styles.itemMain}>
                    <div className={styles.itemTitleRow}>
                      <span className={styles.itemTitle}>{item.title}</span>
                    </div>
                    <p className={styles.itemDesc}>{item.desc}</p>
                  </div>
                  <span className={`${styles.badge} ${badgeClass}`}>
                    {item.category}
                  </span>
                </button>
              );
            })
          )}
        </div>

        {/* Keyboard Shortcut Hints Footer */}
        <div className={styles.footer}>
          <span className={styles.footerHint}>
            <kbd className={styles.footerKbd}>↑</kbd>
            <kbd className={styles.footerKbd}>↓</kbd>
            to navigate
          </span>
          <span className={styles.footerHint}>
            <kbd className={styles.footerKbd}>↵</kbd>
            to select
          </span>
          <span className={styles.footerHint}>
            <kbd className={styles.footerKbd}>esc</kbd>
            to close
          </span>
        </div>
      </div>
    </div>
  );
}

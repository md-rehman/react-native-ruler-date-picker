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
  // Sections
  {
    id: 'sec-quickstart',
    title: 'Quick Start',
    desc: 'Minimal setup example & React state binding',
    category: 'Section',
    href: '/docs#quick-start',
    keywords: ['start', 'intro', 'example', 'react', 'code', 'minimal']
  },
  {
    id: 'sec-install',
    title: 'Installation & Peer Dependencies',
    desc: 'Package install, react-native-reanimated & gesture-handler setup',
    category: 'Section',
    href: '/docs#installation',
    keywords: ['install', 'npm', 'pnpm', 'yarn', 'expo', 'reanimated', 'gesture', 'dependencies']
  },
  {
    id: 'sec-anatomy',
    title: 'Compound Anatomy',
    desc: 'Root, Track, Needle & Ticks modular sub-components',
    category: 'Section',
    href: '/docs#anatomy',
    keywords: ['anatomy', 'compound', 'modular', 'root', 'track', 'indicator', 'ticks', 'reset']
  },
  {
    id: 'sec-props',
    title: 'Component Props Reference',
    desc: 'Complete configuration table, prop types, defaults & descriptions',
    category: 'Section',
    href: '/docs#props',
    keywords: ['props', 'api', 'types', 'options', 'parameters', 'reference', 'table']
  },
  {
    id: 'sec-theming',
    title: 'Theme Configuration',
    desc: 'Appearance tokens, custom colors, ticks tint & dark mode',
    category: 'Section',
    href: '/docs#theming',
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

  // Compound Components
  {
    id: 'comp-root',
    title: '<Ruler.Root>',
    desc: 'State Provider, inertial decay physics & gesture controller context',
    category: 'Component',
    href: '/docs#anatomy',
    keywords: ['root', 'provider', 'context', 'gesture', 'physics', 'reanimated']
  },
  {
    id: 'comp-header',
    title: '<Ruler.Header>',
    desc: 'Displays the currently active date, month, year or custom label',
    category: 'Component',
    href: '/docs#anatomy',
    keywords: ['header', 'date', 'month', 'year', 'format', 'label']
  },
  {
    id: 'comp-track',
    title: '<Ruler.Track>',
    desc: 'Viewport boundary & horizontal pan gesture interaction arena',
    category: 'Component',
    href: '/docs#anatomy',
    keywords: ['track', 'viewport', 'drag', 'pan', 'horizontal', 'overflow']
  },
  {
    id: 'comp-indicator',
    title: '<Ruler.Indicator>',
    desc: 'Center cursor needle with customizable width, height, corner radius & color',
    category: 'Component',
    href: '/docs#anatomy',
    keywords: ['indicator', 'needle', 'cursor', 'center', 'pointer', 'marker']
  },
  {
    id: 'comp-ticks',
    title: '<Ruler.Ticks>',
    desc: 'Windowed virtualized graduations rendered at 60 FPS',
    category: 'Component',
    href: '/docs#anatomy',
    keywords: ['ticks', 'graduations', 'virtualized', 'performance', '60fps', 'lines']
  },
  {
    id: 'comp-reset',
    title: '<Ruler.ResetButton>',
    desc: 'Context-aware reset button that automatically appears when scrolled away from today',
    category: 'Component',
    href: '/docs#anatomy',
    keywords: ['reset', 'today', 'jump', 'button', 'action']
  },
  {
    id: 'comp-range',
    title: '<RulerRange.*>',
    desc: 'Range selection compound system with highlight band & interval headers',
    category: 'Component',
    href: '/docs#anatomy',
    keywords: ['range', 'selection', 'interval', 'span', 'highlight', 'start', 'end']
  },

  // Theme Tokens
  {
    id: 'theme-indicatorColor',
    title: 'theme.indicatorColor',
    desc: 'Primary color of the center needle cursor (default: #0A84FF)',
    category: 'Theming',
    href: '/docs#theming',
    keywords: ['indicator', 'needle', 'color', 'theme', 'blue']
  },
  {
    id: 'theme-accentColor',
    title: 'theme.accentColor',
    desc: 'Highlight tint for active marks, headers & selection',
    category: 'Theming',
    href: '/docs#theming',
    keywords: ['accent', 'highlight', 'active', 'color', 'theme']
  },
  {
    id: 'theme-defaultTickColor',
    title: 'theme.defaultTickColor',
    desc: 'Default color of standard graduation marks (default: #8E8E93)',
    category: 'Theming',
    href: '/docs#theming',
    keywords: ['tick', 'color', 'gray', 'standard', 'graduations']
  },
  {
    id: 'theme-labelColor',
    title: 'theme.labelColor',
    desc: 'Text color for date numbers, month headers and tick labels',
    category: 'Theming',
    href: '/docs#theming',
    keywords: ['label', 'text', 'color', 'font', 'date']
  },
  {
    id: 'theme-rangeHighlightColor',
    title: 'theme.rangeHighlightColor',
    desc: 'Tint color for selected interval highlight band',
    category: 'Theming',
    href: '/docs#theming',
    keywords: ['range', 'band', 'highlight', 'color', 'selection']
  }
];

// Add props dynamically from prop definitions
const SEARCH_INDEX: SearchItem[] = [
  ...STATIC_SEARCH_ITEMS,
  ...PROP_DEFINITIONS.map((prop: PropDefinition) => ({
    id: `prop-${prop.name}`,
    title: `${prop.name}`,
    desc: `${prop.type} — ${prop.description || 'Configurable ruler property'}`,
    category: 'Prop' as const,
    href: '/docs#props',
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

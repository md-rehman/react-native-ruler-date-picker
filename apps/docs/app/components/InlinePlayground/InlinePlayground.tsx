"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { View, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  RulerDatePicker,
  RulerDateRangePicker,
  RulerRoot,
  RulerTrack,
  RulerIndicator,
  RulerTicks,
  RulerHeader,
  RulerResetButton,
  formatDateString,
} from 'react-native-ruler-date-picker';
import { highlightCode } from '../../../utils/highlightCode';
import { parseCodeToProps } from '../../../utils/liveCodeParser';
import styles from './InlinePlayground.module.css';

export interface InlinePlaygroundProps {
  title?: string;
  type?: 'single' | 'range' | 'lens' | 'compound';
  props?: Record<string, any>;
  jsxCode: string;
}

export default function InlinePlayground({
  title = 'Interactive Component Preview',
  type = 'single',
  props: initialProps = {},
  jsxCode,
}: InlinePlaygroundProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [code, setCode] = useState<string>(jsxCode);
  const [parsedProps, setParsedProps] = useState<Record<string, any>>(initialProps);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [dateString, setDateString] = useState<string>('');
  const [range, setRange] = useState<{ start: Date; end: Date }>({
    start: new Date(),
    end: new Date(Date.now() + 7 * 86400000),
  });
  const [copied, setCopied] = useState(false);
  const [previewWidth, setPreviewWidth] = useState(360);

  const overlayRef = useRef<HTMLPreElement | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMounted(true);
    setDateString(formatDateString(new Date()));
  }, []);

  // Update code when jsxCode prop changes
  useEffect(() => {
    setCode(jsxCode);
    setParsedProps(initialProps);
  }, [jsxCode, initialProps]);

  // Handle live code edits
  const handleCodeChange = useCallback((newCode: string) => {
    setCode(newCode);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      const res = parseCodeToProps(newCode);
      if (res.success && res.props) {
        setParsedProps((prev) => ({
          ...prev,
          ...res.props,
        }));
      }
    }, 250);
  }, []);

  const handleResetCode = () => {
    setCode(jsxCode);
    setParsedProps(initialProps);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleOpenInPlayground = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('ruler-playground-incoming-code', code);
    }
    router.push('/playground');
  };

  const isCodeModified = code.trim() !== jsxCode.trim();
  const effectiveWidth = parsedProps.width ?? previewWidth;

  const renderPreview = () => {
    if (!mounted) {
      return (
        <div style={{ height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)' }}>
          Loading interactive ruler...
        </div>
      );
    }

    if (type === 'range') {
      return (
        <GestureHandlerRootView style={rnStyles.root}>
          <View
            style={rnStyles.container}
            onLayout={(e) => {
              const w = e.nativeEvent.layout.width;
              if (w > 0) setPreviewWidth(w);
            }}
          >
            <RulerDateRangePicker
              value={range}
              width={effectiveWidth}
              onChange={({ startDate, endDate }) => {
                setRange({ start: startDate, end: endDate });
              }}
              {...parsedProps}
            />
          </View>
        </GestureHandlerRootView>
      );
    }

    if (type === 'compound') {
      return (
        <GestureHandlerRootView style={rnStyles.root}>
          <View
            style={rnStyles.container}
            onLayout={(e) => {
              const w = e.nativeEvent.layout.width;
              if (w > 0) setPreviewWidth(w);
            }}
          >
            <RulerRoot
              value={selectedDate}
              width={effectiveWidth}
              onChange={(date, str) => {
                setSelectedDate(date);
                setDateString(str);
              }}
              {...parsedProps}
            >
              <RulerHeader showResetToToday={false} />
              <RulerTrack>
                <RulerIndicator />
                <RulerTicks />
              </RulerTrack>
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: 14 }}>
                <RulerResetButton />
              </div>
            </RulerRoot>
          </View>
        </GestureHandlerRootView>
      );
    }

    // Default: 'single' or 'lens'
    return (
      <GestureHandlerRootView style={rnStyles.root}>
        <View
          style={rnStyles.container}
          onLayout={(e) => {
            const w = e.nativeEvent.layout.width;
            if (w > 0) setPreviewWidth(w);
          }}
        >
          <RulerDatePicker
            value={selectedDate}
            width={effectiveWidth}
            onChange={(date, str) => {
              setSelectedDate(date);
              setDateString(str);
            }}
            lensEffect={type === 'lens'}
            {...parsedProps}
          />
        </View>
      </GestureHandlerRootView>
    );
  };

  return (
    <div className={styles.container}>
      {/* ── Top Bar: Title on Left, Open in Playground on Right ── */}
      <div className={styles.topBar}>
        <div className={styles.topBarTitle}>
          <span>{title}</span>
          <span className={styles.badgeLive}>Live</span>
        </div>

        <button
          onClick={handleOpenInPlayground}
          className={styles.openPlaygroundBtn}
          title="Open and edit this example in the full playground"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
            <polyline points="15 3 21 3 21 9"></polyline>
            <line x1="10" y1="14" x2="21" y2="3"></line>
          </svg>
          <span>Open in Playground</span>
        </button>
      </div>

      <div className={styles.splitArea}>
        {/* ── Left Pane: Interactive Preview ── */}
        <div className={styles.previewPane}>
          <div className={styles.previewHeader}>
            <span className={styles.previewLabel}>Interactive Canvas</span>
            <div className={styles.readoutBadge}>
              <span className={styles.readoutDot} />
              {type === 'range' ? (
                <span>
                  {formatDateString(range.start)} → {formatDateString(range.end)}
                </span>
              ) : (
                <span>{dateString || 'Selecting...'}</span>
              )}
            </div>
          </div>

          <div className={styles.rulerContainer}>
            {renderPreview()}
          </div>

          <div className={styles.previewHint}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14"></path>
              <path d="m12 5 7 7-7 7"></path>
            </svg>
            <span>Drag or scroll horizontally to interact with 60 FPS physics</span>
          </div>
        </div>

        {/* ── Right Pane: Editable JSX Code with Syntax Highlighting ── */}
        <div className={styles.codePane}>
          <div className={styles.codeHeader}>
            <div className={styles.codeLabelWrapper}>
              <span className={styles.codeLabel}>JSX Code</span>
              {isCodeModified && <span className={styles.editedBadge}>Edited</span>}
            </div>

            <div className={styles.codeActions}>
              {isCodeModified && (
                <button
                  onClick={handleResetCode}
                  className={styles.resetBtn}
                  title="Reset to default code"
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                    <path d="M3 3v5h5"></path>
                  </svg>
                  <span>Reset</span>
                </button>
              )}

              <button
                onClick={handleCopy}
                className={styles.copyButton}
                title="Copy JSX Code"
                aria-label="Copy JSX Code"
              >
                {copied ? (
                  <>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span style={{ color: '#22c55e' }}>Copied</span>
                  </>
                ) : (
                  <>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className={styles.editorContainer}>
            <pre className={styles.highlightOverlay} ref={overlayRef} aria-hidden="true">
              <code
                className="language-tsx"
                dangerouslySetInnerHTML={{
                  __html: highlightCode(code, 'tsx') + '\n',
                }}
              />
            </pre>
            <textarea
              value={code}
              onChange={(e) => handleCodeChange(e.target.value)}
              onScroll={(e) => {
                if (overlayRef.current) {
                  overlayRef.current.scrollTop = e.currentTarget.scrollTop;
                  overlayRef.current.scrollLeft = e.currentTarget.scrollLeft;
                }
              }}
              className={styles.editorTextarea}
              spellCheck={false}
              autoCapitalize="off"
              autoComplete="off"
              autoCorrect="off"
              placeholder="Edit JSX props or code..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}

const rnStyles = StyleSheet.create({
  root: {
    width: '100%',
    flex: 1,
    minHeight: 240,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

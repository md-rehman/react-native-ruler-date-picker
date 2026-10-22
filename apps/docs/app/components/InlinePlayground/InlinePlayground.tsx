"use client";

import React, { useState, useEffect } from 'react';
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
  props = {},
  jsxCode,
}: InlinePlaygroundProps) {
  const [mounted, setMounted] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [dateString, setDateString] = useState<string>('');
  const [range, setRange] = useState<{ start: Date; end: Date }>({
    start: new Date(),
    end: new Date(Date.now() + 7 * 86400000),
  });
  const [copied, setCopied] = useState(false);

  const [previewWidth, setPreviewWidth] = useState(360);

  useEffect(() => {
    setMounted(true);
    setDateString(formatDateString(new Date()));
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jsxCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const renderPreview = () => {
    if (!mounted) {
      return (
        <div style={{ height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)' }}>
          Loading interactive ruler...
        </div>
      );
    }

    const effectiveWidth = props.width ?? previewWidth;

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
              {...props}
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
              {...props}
            >
              <RulerHeader showResetToToday={false} />
              <RulerTrack>
                <RulerIndicator />
                <RulerTicks />
              </RulerTrack>
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: 12 }}>
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
            {...props}
          />
        </View>
      </GestureHandlerRootView>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.topBar}>
        <div className={styles.windowControls}>
          <span className={`${styles.dot} ${styles.dotRed}`} />
          <span className={`${styles.dot} ${styles.dotYellow}`} />
          <span className={`${styles.dot} ${styles.dotGreen}`} />
        </div>
        <div className={styles.topBarTitle}>
          <span>{title}</span>
          <span className={styles.badgeLive}>Live</span>
        </div>
        <div style={{ width: 48 }} />
      </div>

      <div className={styles.splitArea}>
        {/* Left Pane: Interactive Preview */}
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

        {/* Right Pane: Code (JSX only) */}
        <div className={styles.codePane}>
          <div className={styles.codeHeader}>
            <span className={styles.codeLabel}>JSX Code</span>
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

          <div className={styles.codeScroll}>
            <pre>
              <code>{jsxCode}</code>
            </pre>
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
    minHeight: 120,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  container: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
});

"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  View as RNViewComponent,
  Text as RNTextComponent,
  TouchableOpacity as RNTouchableOpacityComponent,
  StyleSheet,
  type ViewProps,
  type TextProps,
  type TouchableOpacityProps,
} from 'react-native';

const View = RNViewComponent as unknown as React.ComponentType<ViewProps>;
const Text = RNTextComponent as unknown as React.ComponentType<TextProps>;
const TouchableOpacity = RNTouchableOpacityComponent as unknown as React.ComponentType<TouchableOpacityProps>;
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
  RulerLensTrack,
  RulerRangeRoot,
  RulerRangeTrack,
  RulerRangeIndicator,
  RulerRangeTicks,
  RulerRangeHeader,
  useRulerDatePicker,
  useRulerDateRangePicker,
  useRulerContext,
  useRulerRangeContext,
  Tick as RNTickComponent,
  formatDateString,
} from 'react-native-ruler-date-picker';

const Tick = RNTickComponent as unknown as React.ComponentType<any>;
import { GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { highlightCode } from '../../../utils/highlightCode';
import { parseCodeToProps } from '../../../utils/liveCodeParser';
import styles from './InlinePlayground.module.css';

export interface InlinePlaygroundProps {
  title?: string;
  type?:
    | 'single'
    | 'range'
    | 'lens'
    | 'compound'
    | 'custom-indicator'
    | 'custom-arrow'
    | 'custom-pill'
    | 'headless'
    | 'headless-range'
    | 'range-compound'
    | 'compound-lens'
    | 'context'
    | 'range-context';
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
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [parsedProps, setParsedProps] = useState<Record<string, any>>(() => {
    const res = parseCodeToProps(jsxCode);
    return {
      ...initialProps,
      ...(res.success && res.props ? res.props : {}),
    };
  });
  const [dateString, setDateString] = useState<string>('');
  const [range, setRange] = useState<{ start: Date; end: Date }>(() => ({
    start: new Date(),
    end: new Date(Date.now() + 7 * 86400000),
  }));
  const [copied, setCopied] = useState(false);
  const [previewWidth, setPreviewWidth] = useState(360);

  const overlayRef = useRef<HTMLPreElement | null>(null);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setMounted(true);
    setDateString(formatDateString(new Date()));
  }, []);

  // Update code when jsxCode prop changes
  useEffect(() => {
    setCode(jsxCode);
    const res = parseCodeToProps(jsxCode);
    setParsedProps({
      ...initialProps,
      ...(res.success && res.props ? res.props : {}),
    });
  }, [jsxCode]);

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
    const res = parseCodeToProps(jsxCode);
    setParsedProps({
      ...initialProps,
      ...(res.success && res.props ? res.props : {}),
    });
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
      const showHeaderReset = parsedProps.headerShowReset ?? false;
      const headerResetLabel = parsedProps.headerResetLabel;
      const resetBtnLabel = parsedProps.resetButtonLabel ?? parsedProps.buttonLabel ?? 'Jump to Today';

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
              <RulerHeader showResetToToday={showHeaderReset} resetLabel={headerResetLabel} />
              <RulerTrack>
                <RulerIndicator style={parsedProps.indicatorStyle} />
                <RulerTicks />
              </RulerTrack>
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: 14 }}>
                <RulerResetButton
                  label={resetBtnLabel}
                  style={parsedProps.resetButtonStyle}
                  textStyle={parsedProps.resetButtonTextStyle}
                />
              </div>
            </RulerRoot>
          </View>
        </GestureHandlerRootView>
      );
    }

    if (type === 'custom-indicator') {
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
                <RulerIndicator style={parsedProps.indicatorStyle ?? { bottom: 18 }}>
                  <View
                    style={{
                      width: 14,
                      height: 14,
                      backgroundColor: parsedProps.customColor ?? '#38BDF8',
                      transform: [{ rotate: parsedProps.customRotate ?? '45deg' }],
                      borderRadius: 3,
                      shadowColor: parsedProps.customColor ?? '#38BDF8',
                      shadowOpacity: 0.8,
                      shadowRadius: 8,
                      ...(parsedProps.customStyle ?? {}),
                    }}
                  />
                </RulerIndicator>
                <RulerTicks />
              </RulerTrack>
            </RulerRoot>
          </View>
        </GestureHandlerRootView>
      );
    }

    if (type === 'custom-arrow') {
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
                <RulerIndicator style={parsedProps.indicatorStyle ?? { top: 2 }}>
                  <View
                    style={{
                      width: 0,
                      height: 0,
                      borderLeftWidth: 8,
                      borderRightWidth: 8,
                      borderTopWidth: 12,
                      borderLeftColor: 'transparent',
                      borderRightColor: 'transparent',
                      borderTopColor: parsedProps.customColor ?? '#EC4899',
                      ...(parsedProps.customStyle ?? {}),
                    }}
                  />
                </RulerIndicator>
                <RulerTicks />
              </RulerTrack>
            </RulerRoot>
          </View>
        </GestureHandlerRootView>
      );
    }

    if (type === 'custom-pill') {
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
                <RulerIndicator style={parsedProps.indicatorStyle ?? { bottom: 8 }}>
                  <View
                    style={{
                      width: 6,
                      height: 44,
                      backgroundColor: parsedProps.customColor ?? '#10B981',
                      borderRadius: 3,
                      shadowColor: parsedProps.customColor ?? '#10B981',
                      shadowOpacity: 0.9,
                      shadowRadius: 8,
                      ...(parsedProps.customStyle ?? {}),
                    }}
                  />
                </RulerIndicator>
                <RulerTicks />
              </RulerTrack>
            </RulerRoot>
          </View>
        </GestureHandlerRootView>
      );
    }

    if (type === 'headless') {
      return (
        <GestureHandlerRootView style={rnStyles.root}>
          <View
            style={rnStyles.container}
            onLayout={(e) => {
              const w = e.nativeEvent.layout.width;
              if (w > 0) setPreviewWidth(w);
            }}
          >
            <HeadlessPickerDemo
              width={effectiveWidth}
              tickSpacing={parsedProps.tickSpacing ?? 28}
              rulerHeight={parsedProps.rulerHeight ?? 64}
              buttonLabel={parsedProps.buttonLabel ?? 'Today'}
            />
          </View>
        </GestureHandlerRootView>
      );
    }

    if (type === 'headless-range') {
      return (
        <GestureHandlerRootView style={rnStyles.root}>
          <View
            style={rnStyles.container}
            onLayout={(e) => {
              const w = e.nativeEvent.layout.width;
              if (w > 0) setPreviewWidth(w);
            }}
          >
            <HeadlessRangeDemo
              width={effectiveWidth}
              tickSpacing={parsedProps.tickSpacing ?? 28}
              rulerHeight={parsedProps.rulerHeight ?? 64}
              minSpanDays={parsedProps.minSpanDays ?? 2}
              maxSpanDays={parsedProps.maxSpanDays ?? 21}
            />
          </View>
        </GestureHandlerRootView>
      );
    }

    if (type === 'range-compound') {
      return (
        <GestureHandlerRootView style={rnStyles.root}>
          <View
            style={rnStyles.container}
            onLayout={(e) => {
              const w = e.nativeEvent.layout.width;
              if (w > 0) setPreviewWidth(w);
            }}
          >
            <RulerRangeRoot
              value={range}
              width={effectiveWidth}
              onChange={({ startDate, endDate }) => {
                setRange({ start: startDate, end: endDate });
              }}
              {...parsedProps}
            >
              <RulerRangeHeader />
              <RulerRangeTrack>
                <RulerRangeIndicator />
                <RulerRangeTicks />
              </RulerRangeTrack>
            </RulerRangeRoot>
          </View>
        </GestureHandlerRootView>
      );
    }

    if (type === 'compound-lens') {
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
              lensEffect
              {...parsedProps}
            >
              <RulerHeader
                showResetToToday={parsedProps.headerShowReset ?? false}
                resetLabel={parsedProps.headerResetLabel}
              />
              <RulerLensTrack />
            </RulerRoot>
          </View>
        </GestureHandlerRootView>
      );
    }

    if (type === 'context') {
      return (
        <GestureHandlerRootView style={rnStyles.root}>
          <View
            style={rnStyles.container}
            onLayout={(e) => {
              const w = e.nativeEvent.layout.width;
              if (w > 0) setPreviewWidth(w);
            }}
          >
            <CustomContextDemo
              width={effectiveWidth}
              buttonLabel={parsedProps.buttonLabel ?? 'Reset'}
              {...parsedProps}
            />
          </View>
        </GestureHandlerRootView>
      );
    }

    if (type === 'range-context') {
      return (
        <GestureHandlerRootView style={rnStyles.root}>
          <View
            style={rnStyles.container}
            onLayout={(e) => {
              const w = e.nativeEvent.layout.width;
              if (w > 0) setPreviewWidth(w);
            }}
          >
            <CustomRangeContextDemo width={effectiveWidth} {...parsedProps} />
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

function HeadlessPickerDemo({
  width,
  tickSpacing = 28,
  rulerHeight = 60,
  buttonLabel = 'Today',
}: {
  width: number;
  tickSpacing?: number;
  rulerHeight?: number;
  buttonLabel?: string;
}) {
  const [date, setDate] = useState<Date>(new Date());
  const ruler = useRulerDatePicker({
    value: date,
    width,
    tickSpacing,
    rulerHeight,
    onChange: (d) => setDate(d),
  });

  const animatedStyle = useAnimatedStyle(
    () => ({
      transform: [{ translateX: ruler.translateX.value }],
    }),
    [ruler.translateX]
  );

  return (
    <View style={rnStyles.headlessWrapper}>
      <View style={rnStyles.headlessHeader}>
        <Text style={rnStyles.headlessSublabel}>ACTIVE DATE</Text>
        <Text style={[rnStyles.headlessDate, { color: ruler.theme.accentColor }]}>
          {ruler.selectedDateStr}
        </Text>
      </View>

      <GestureDetector gesture={ruler.panGesture as any}>
        <View style={[rnStyles.headlessTrack, { width, height: ruler.rulerHeight }]}>
          <View
            pointerEvents="none"
            style={[
              rnStyles.headlessNeedle,
              { backgroundColor: ruler.theme.accentColor },
            ]}
          />

          <Animated.View
            style={[
              rnStyles.ticksWrapper,
              { left: width / 2 },
              animatedStyle,
            ]}
          >
            {ruler.visibleTicks.map((tick) => (
              <Tick
                key={tick.offset}
                tick={tick}
                tickSpacing={ruler.tickSpacing}
                rulerHeight={ruler.rulerHeight}
              />
            ))}
          </Animated.View>
        </View>
      </GestureDetector>

      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => ruler.resetToToday(true)}
        style={[rnStyles.headlessResetBtn, { backgroundColor: `${ruler.theme.accentColor}18` }]}
      >
        <Text style={[rnStyles.headlessResetText, { color: ruler.theme.accentColor }]}>
          {buttonLabel}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

function HeadlessRangeDemo({
  width,
  tickSpacing = 28,
  rulerHeight = 60,
  minSpanDays = 2,
  maxSpanDays = 21,
}: {
  width: number;
  tickSpacing?: number;
  rulerHeight?: number;
  minSpanDays?: number;
  maxSpanDays?: number;
}) {
  const [range, setRange] = useState({
    start: new Date(),
    end: new Date(Date.now() + 6 * 86400000),
  });

  const rangeRuler = useRulerDateRangePicker({
    value: range,
    width,
    tickSpacing,
    rulerHeight,
    minSpanDays,
    maxSpanDays,
    onChange: ({ startDate, endDate }) => {
      setRange({ start: startDate, end: endDate });
    },
  });

  const animatedStyle = useAnimatedStyle(
    () => ({
      transform: [{ translateX: rangeRuler.translateX.value }],
    }),
    [rangeRuler.translateX]
  );

  const highlightLeft = rangeRuler.startOffset * rangeRuler.tickSpacing - rangeRuler.tickSpacing / 2;
  const highlightWidth = Math.max(
    rangeRuler.tickSpacing,
    (rangeRuler.endOffset - rangeRuler.startOffset + 1) * rangeRuler.tickSpacing
  );

  return (
    <View style={rnStyles.headlessWrapper}>
      <View style={rnStyles.headlessRangeHeader}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => rangeRuler.scrollToHandle('start', true)}
          style={[
            rnStyles.headlessHandlePill,
            rangeRuler.activeHandle === 'start' && {
              borderColor: rangeRuler.theme.accentColor,
              backgroundColor: `${rangeRuler.theme.accentColor}20`,
            },
          ]}
        >
          <Text style={rnStyles.headlessPillSub}>START</Text>
          <Text
            style={[
              rnStyles.headlessPillDate,
              { color: rangeRuler.activeHandle === 'start' ? rangeRuler.theme.accentColor : '#8E8E93' },
            ]}
          >
            {rangeRuler.startDateStr}
          </Text>
        </TouchableOpacity>

        <View style={rnStyles.headlessSpanBadge}>
          <Text style={[rnStyles.headlessSpanText, { color: rangeRuler.theme.accentColor }]}>
            ➔ {rangeRuler.spanDays} days
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => rangeRuler.scrollToHandle('end', true)}
          style={[
            rnStyles.headlessHandlePill,
            rangeRuler.activeHandle === 'end' && {
              borderColor: rangeRuler.theme.accentColor,
              backgroundColor: `${rangeRuler.theme.accentColor}20`,
            },
          ]}
        >
          <Text style={rnStyles.headlessPillSub}>END</Text>
          <Text
            style={[
              rnStyles.headlessPillDate,
              { color: rangeRuler.activeHandle === 'end' ? rangeRuler.theme.accentColor : '#8E8E93' },
            ]}
          >
            {rangeRuler.endDateStr}
          </Text>
        </TouchableOpacity>
      </View>

      <GestureDetector gesture={rangeRuler.panGesture as any}>
        <View style={[rnStyles.headlessTrack, { width, height: rangeRuler.rulerHeight }]}>
          <View
            pointerEvents="none"
            style={[
              rnStyles.headlessNeedle,
              { backgroundColor: rangeRuler.theme.accentColor },
            ]}
          />

          <Animated.View
            style={[
              rnStyles.ticksWrapper,
              { left: width / 2 },
              animatedStyle,
            ]}
          >
            <View
              pointerEvents="none"
              style={[
                rnStyles.highlightStrip,
                {
                  left: highlightLeft,
                  width: highlightWidth,
                  height: rangeRuler.rulerHeight,
                  backgroundColor: rangeRuler.theme.rangeHighlightColor,
                },
              ]}
            />
            {rangeRuler.visibleTicks.map((tick) => (
              <Tick
                key={tick.offset}
                tick={tick}
                tickSpacing={rangeRuler.tickSpacing}
                rulerHeight={rangeRuler.rulerHeight}
              />
            ))}
          </Animated.View>
        </View>
      </GestureDetector>
    </View>
  );
}

function ContextHeaderConsumer({ buttonLabel = 'Reset' }: { buttonLabel?: string }) {
  const { selectedDateStr, resetToToday, theme } = useRulerContext();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', paddingHorizontal: 24, marginBottom: 14 }}>
      <View>
        <Text style={{ fontSize: 10, fontWeight: '700', color: '#8E8E93', letterSpacing: 0.5, marginBottom: 2 }}>ACTIVE DATE</Text>
        <Text style={{ color: theme.accentColor, fontWeight: '700', fontSize: 16 }}>{selectedDateStr}</Text>
      </View>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => resetToToday(true)}
        style={{ paddingVertical: 5, paddingHorizontal: 14, borderRadius: 14, backgroundColor: `${theme.accentColor}18` }}
      >
        <Text style={{ color: theme.accentColor, fontWeight: '600', fontSize: 12 }}>{buttonLabel}</Text>
      </TouchableOpacity>
    </View>
  );
}

function CustomContextDemo({
  width,
  buttonLabel,
  ...props
}: {
  width: number;
  buttonLabel?: string;
  [key: string]: any;
}) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  return (
    <RulerRoot value={selectedDate} width={width} onChange={setSelectedDate} {...props}>
      <ContextHeaderConsumer buttonLabel={buttonLabel} />
      <RulerTrack>
        <RulerIndicator />
        <RulerTicks />
      </RulerTrack>
    </RulerRoot>
  );
}

function RangeDurationConsumer() {
  const { spanDays, startDateStr, endDateStr, theme } = useRulerRangeContext();
  return (
    <View style={{ alignItems: 'center', marginBottom: 14 }}>
      <Text style={{ color: theme.accentColor, fontWeight: '800', fontSize: 17 }}>
        {spanDays} {spanDays === 1 ? 'Night' : 'Nights'} Selected
      </Text>
      <Text style={{ color: '#8E8E93', fontSize: 12, marginTop: 3 }}>
        {startDateStr} ➔ {endDateStr}
      </Text>
    </View>
  );
}

function CustomRangeContextDemo({ width, ...props }: { width: number; [key: string]: any }) {
  const [range, setRange] = useState({
    start: new Date(),
    end: new Date(Date.now() + 7 * 86400000),
  });

  return (
    <RulerRangeRoot
      value={range}
      width={width}
      onChange={({ startDate, endDate }) => setRange({ start: startDate, end: endDate })}
      {...props}
    >
      <RangeDurationConsumer />
      <RulerRangeTrack>
        <RulerRangeIndicator />
        <RulerRangeTicks />
      </RulerRangeTrack>
    </RulerRangeRoot>
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
  headlessWrapper: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 12,
  },
  headlessHeader: {
    alignItems: 'center',
    marginBottom: 12,
  },
  headlessSublabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#8E8E93',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  headlessDate: {
    fontSize: 18,
    fontWeight: '700',
  },
  headlessTrack: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  headlessNeedle: {
    position: 'absolute',
    bottom: 0,
    width: 3,
    height: 38,
    borderRadius: 1.5,
    zIndex: 10,
  },
  ticksWrapper: {
    position: 'absolute',
    height: '100%',
    width: 0,
  },
  highlightStrip: {
    position: 'absolute',
    bottom: 0,
    borderRadius: 8,
    zIndex: 1,
  },
  headlessResetBtn: {
    marginTop: 14,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 16,
  },
  headlessResetText: {
    fontSize: 13,
    fontWeight: '600',
  },
  headlessRangeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 14,
  },
  headlessHandlePill: {
    paddingVertical: 5,
    paddingHorizontal: 14,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: 'transparent',
    alignItems: 'center',
  },
  headlessPillSub: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
    color: '#8E8E93',
    marginBottom: 2,
  },
  headlessPillDate: {
    fontSize: 13,
    fontWeight: '700',
  },
  headlessSpanBadge: {
    alignItems: 'center',
  },
  headlessSpanText: {
    fontSize: 12,
    fontWeight: '700',
  },
});

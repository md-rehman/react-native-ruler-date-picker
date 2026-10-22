// @ts-nocheck
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { View, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { RulerDatePicker } from 'react-native-ruler-date-picker';
import styles from './HeroDemo.module.css';

const PRESETS = [
  {
    id: 'midnight',
    label: 'Midnight Slate',
    theme: {
      background: 'transparent',
      indicatorColor: '#38BDF8',
      accentColor: '#38BDF8',
      labelColor: '#94A3B8',
      defaultTickColor: '#475569',
    },
    tickSpacing: 24,
    ticks: 'calendar',
  },
  {
    id: 'cyber',
    label: 'Cyber Neon',
    theme: {
      background: 'transparent',
      indicatorColor: '#4ADE80',
      accentColor: '#22C55E',
      labelColor: '#A1A1AA',
      defaultTickColor: '#52525B',
    },
    tickSpacing: 28,
    ticks: 'calendar',
  },
  {
    id: 'amber',
    label: 'Sunset Amber',
    theme: {
      background: 'transparent',
      indicatorColor: '#F59E0B',
      accentColor: '#F59E0B',
      labelColor: '#A1A1AA',
      defaultTickColor: '#52525B',
    },
    tickSpacing: 26,
    ticks: 'calendar',
  },
  {
    id: 'metric',
    label: 'Metric 3-Tier',
    theme: {
      background: 'transparent',
      indicatorColor: '#818CF8',
      accentColor: '#6366F1',
      labelColor: '#94A3B8',
      defaultTickColor: '#475569',
    },
    tickSpacing: 22,
    ticks: 'metric',
  },
];

export default function HeroDemo() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [dateStr, setDateStr] = useState<string>('');
  const [activePresetIndex, setActivePresetIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const today = new Date();
    setSelectedDate(today);
    setDateStr(today.toISOString().split('T')[0]);
  }, []);

  const activePreset = PRESETS[activePresetIndex];

  const formattedDate = React.useMemo(() => {
    if (!mounted || !selectedDate) return 'Loading date...';
    try {
      return selectedDate.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch (e) {
      return dateStr;
    }
  }, [selectedDate, dateStr, mounted]);

  return (
    <div className={styles.demoCard}>
      <div className={styles.cardHeader}>
        <div className={styles.trafficLights}>
          <span className={`${styles.dot} ${styles.dotRed}`} />
          <span className={`${styles.dot} ${styles.dotYellow}`} />
          <span className={`${styles.dot} ${styles.dotGreen}`} />
          <span className={styles.cardTitle}>Live Interactive Preview</span>
        </div>

        <div className={styles.presetTabs}>
          {PRESETS.map((preset, idx) => (
            <button
              key={preset.id}
              onClick={() => setActivePresetIndex(idx)}
              className={`${styles.presetTab} ${activePresetIndex === idx ? styles.presetTabActive : ''}`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.cardBody}>
        <div className={styles.dateDisplay}>
          <span className={styles.dateLabel}>Active Selection</span>
          <span className={styles.dateValue}>{formattedDate}</span>
        </div>

        <div className={styles.pickerWrapper}>
          {mounted && (
            <GestureHandlerRootView style={rnStyles.root}>
              <View style={rnStyles.pickerContainer}>
                <RulerDatePicker
                  value={selectedDate}
                  onChange={(newDate, str) => {
                    setSelectedDate(newDate);
                    setDateStr(str);
                  }}
                  theme={activePreset.theme}
                  ticks={activePreset.ticks}
                  tickSpacing={activePreset.tickSpacing}
                  rulerHeight={60}
                  indicator={{ width: 2, height: 40 }}
                  header={false}
                />
              </View>
            </GestureHandlerRootView>
          )}
        </div>
      </div>

      <div className={styles.cardFooter}>
        <div className={styles.statusIndicator}>
          <span className={styles.pulseDot} />
          <span>Drag or flick the ruler horizontally • 60 FPS Reanimated 3</span>
        </div>

        <div className={styles.footerActions}>
          <Link href="/playground" className={styles.footerLink}>
            Open in Full Playground →
          </Link>
        </div>
      </div>
    </div>
  );
}

const rnStyles = StyleSheet.create({
  root: {
    width: '100%',
    minHeight: 140,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Switch,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { RulerDatePicker } from 'react-native-ruler-date-picker';

type PresetTab = 'fitness' | 'event' | 'builder';

export default function App() {
  const [activeTab, setActiveTab] = useState<PresetTab>('fitness');

  // Fitness logger state
  const [fitnessDate, setFitnessDate] = useState(new Date());
  const [fitnessLogStr, setFitnessLogStr] = useState('');

  // Event scheduler state
  const [eventDate, setEventDate] = useState(new Date());
  const [eventLogStr, setEventLogStr] = useState('');

  // Preset Builder state
  const [builderDate, setBuilderDate] = useState(new Date());
  const [builderDateStr, setBuilderDateStr] = useState('');
  const [themeMode, setThemeMode] = useState<'dark' | 'neon' | 'sunset'>('neon');
  const [labelInterval, setLabelInterval] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [enableHaptics, setEnableHaptics] = useState(true);
  const [showReset, setShowReset] = useState(true);
  const [tickSpacing, setTickSpacing] = useState(24);

  const getThemeColors = () => {
    switch (themeMode) {
      case 'neon':
        return {
          tickColor: '#334155',
          tickTallColor: '#06B6D4',
          accentColor: '#A855F7',
          indicatorColor: '#EC4899',
          labelColor: '#94A3B8',
          backgroundColor: '#0F172A',
        };
      case 'sunset':
        return {
          tickColor: '#FED7AA',
          tickTallColor: '#F97316',
          accentColor: '#EA580C',
          indicatorColor: '#DC2626',
          labelColor: '#C2410C',
          backgroundColor: '#FFF7ED',
        };
      default:
        return {
          tickColor: '#475569',
          tickTallColor: '#94A3B8',
          accentColor: '#38BDF8',
          indicatorColor: '#38BDF8',
          labelColor: '#CBD5E1',
          backgroundColor: '#1E293B',
        };
    }
  };

  const builderColors = getThemeColors();

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaView
        style={[
          styles.container,
          {
            backgroundColor:
              activeTab === 'fitness'
                ? '#090D16'
                : activeTab === 'builder'
                ? builderColors.backgroundColor
                : '#F8FAFC',
          },
        ]}
      >
        {/* Navigation Header */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'fitness' && styles.activeTab]}
            onPress={() => setActiveTab('fitness')}
          >
            <Text style={[styles.tabText, activeTab === 'fitness' && styles.activeTabText]}>
              Fitness
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'event' && styles.activeTab]}
            onPress={() => setActiveTab('event')}
          >
            <Text style={[styles.tabText, activeTab === 'event' && styles.activeTabText]}>
              Events
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'builder' && styles.activeTab]}
            onPress={() => setActiveTab('builder')}
          >
            <Text style={[styles.tabText, activeTab === 'builder' && styles.activeTabText]}>
              Builder
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab 1: Fitness Logger Timeline */}
        {activeTab === 'fitness' && (
          <ScrollView contentContainerStyle={styles.tabContent}>
            <Text style={[styles.heading, { color: '#F8FAFC' }]}>🏋️ Workout Log</Text>
            <Text style={[styles.subheading, { color: '#64748B' }]}>
              Scroll timeline to select workout date
            </Text>

            <View style={styles.cardDark}>
              <RulerDatePicker
                selectedDate={fitnessDate}
                onSelectDate={(d, str) => {
                  setFitnessDate(d);
                  setFitnessLogStr(str);
                }}
                labelInterval="daily"
                tickColor="#1E293B"
                tickTallColor="#06B6D4"
                accentColor="#A855F7"
                indicatorColor="#A855F7"
                labelColor="#64748B"
                showResetToToday
              />
            </View>

            <View style={styles.statsContainer}>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>45 min</Text>
                <Text style={styles.statLabel}>Duration</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>520 kcal</Text>
                <Text style={styles.statLabel}>Burned</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>142 bpm</Text>
                <Text style={styles.statLabel}>Avg HR</Text>
              </View>
            </View>

            <Text style={[styles.dateFooter, { color: '#A855F7' }]}>
              Logged for: {fitnessLogStr || 'Today'}
            </Text>
          </ScrollView>
        )}

        {/* Tab 2: Event Scheduler */}
        {activeTab === 'event' && (
          <ScrollView contentContainerStyle={styles.tabContent}>
            <Text style={[styles.heading, { color: '#0F172A' }]}>📅 Event Scheduler</Text>
            <Text style={[styles.subheading, { color: '#64748B' }]}>
              Bounded pick between -30 and +60 days
            </Text>

            <View style={styles.cardLight}>
              <RulerDatePicker
                selectedDate={eventDate}
                onSelectDate={(d, str) => {
                  setEventDate(d);
                  setEventLogStr(str);
                }}
                minDate={new Date(Date.now() - 30 * 86400000)}
                maxDate={new Date(Date.now() + 60 * 86400000)}
                labelInterval="weekly"
                tickColor="#CBD5E1"
                tickTallColor="#2563EB"
                accentColor="#2563EB"
                indicatorColor="#2563EB"
                labelColor="#475569"
                showResetToToday
              />
            </View>

            <View style={styles.eventBox}>
              <Text style={styles.eventTitle}>Team Sync & Demo</Text>
              <Text style={styles.eventTime}>📅 {eventLogStr || 'Select Date'} • 10:00 AM</Text>
            </View>
          </ScrollView>
        )}

        {/* Tab 3: Interactive Preset Builder */}
        {activeTab === 'builder' && (
          <ScrollView contentContainerStyle={styles.tabContent}>
            <Text style={[styles.heading, { color: builderColors.accentColor }]}>
              ⚙️ Preset Builder
            </Text>

            <View
              style={[
                styles.cardCustom,
                { backgroundColor: builderColors.backgroundColor },
              ]}
            >
              <RulerDatePicker
                selectedDate={builderDate}
                onSelectDate={(d, str) => {
                  setBuilderDate(d);
                  setBuilderDateStr(str);
                }}
                labelInterval={labelInterval}
                tickSpacing={tickSpacing}
                tickColor={builderColors.tickColor}
                tickTallColor={builderColors.tickTallColor}
                accentColor={builderColors.accentColor}
                indicatorColor={builderColors.indicatorColor}
                labelColor={builderColors.labelColor}
                enableHaptics={enableHaptics}
                showResetToToday={showReset}
              />
            </View>

            {/* Controls */}
            <View style={styles.controlsGroup}>
              <Text style={[styles.controlHeader, { color: builderColors.labelColor }]}>
                Theme Palette
              </Text>
              <View style={styles.row}>
                {(['neon', 'sunset', 'dark'] as const).map((t) => (
                  <TouchableOpacity
                    key={t}
                    style={[
                      styles.btn,
                      themeMode === t && { backgroundColor: builderColors.accentColor },
                    ]}
                    onPress={() => setThemeMode(t)}
                  >
                    <Text style={styles.btnText}>{t.toUpperCase()}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={[styles.controlHeader, { color: builderColors.labelColor }]}>
                Label Interval
              </Text>
              <View style={styles.row}>
                {(['daily', 'weekly', 'monthly'] as const).map((i) => (
                  <TouchableOpacity
                    key={i}
                    style={[
                      styles.btn,
                      labelInterval === i && { backgroundColor: builderColors.accentColor },
                    ]}
                    onPress={() => setLabelInterval(i)}
                  >
                    <Text style={styles.btnText}>{i.toUpperCase()}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.switchRow}>
                <Text style={[styles.switchLabel, { color: builderColors.labelColor }]}>
                  Haptics Enabled
                </Text>
                <Switch value={enableHaptics} onValueChange={setEnableHaptics} />
              </View>

              <View style={styles.switchRow}>
                <Text style={[styles.switchLabel, { color: builderColors.labelColor }]}>
                  Show Reset Button
                </Text>
                <Switch value={showReset} onValueChange={setShowReset} />
              </View>
            </View>
          </ScrollView>
        )}

        <StatusBar style="auto" />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(148, 163, 184, 0.1)',
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#3B82F6',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94A3B8',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  tabContent: {
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  subheading: {
    fontSize: 14,
    marginBottom: 20,
  },
  cardDark: {
    borderRadius: 16,
    backgroundColor: '#0F172A',
    paddingVertical: 10,
    marginBottom: 20,
  },
  cardLight: {
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  cardCustom: {
    borderRadius: 16,
    paddingVertical: 10,
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#06B6D4',
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
  },
  dateFooter: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  eventBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#2563EB',
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0F172A',
  },
  eventTime: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 6,
  },
  controlsGroup: {
    gap: 12,
    marginTop: 10,
  },
  controlHeader: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  btn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: 'rgba(148, 163, 184, 0.2)',
    alignItems: 'center',
  },
  btnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  switchLabel: {
    fontSize: 14,
  },
});

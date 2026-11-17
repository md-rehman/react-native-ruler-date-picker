import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  Platform,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '../../context/ThemeContext';
import { RADII, SPACING } from '../../theme/tokens';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

const PRESET_ACCENTS = [
  '#F59E0B', // Amber
  '#F97316', // Orange
  '#EF4444', // Red
  '#F43F5E', // Rose
  '#EC4899', // Pink
  '#A855F7', // Purple
  '#8B5CF6', // Violet
  '#6366F1', // Indigo
  '#3B82F6', // Blue
  '#0EA5E9', // Sky
  '#06B6D4', // Cyan
  '#14B8A6', // Teal
  '#10B981', // Emerald
  '#84CC16', // Lime
];

const PRESET_NEUTRALS = [
  '#FFFFFF',
  '#F4F4F5',
  '#E4E4E7',
  '#94A3B8',
  '#71717A',
  '#334155',
  '#18181B',
  '#000000',
];

const HUE_SPECTRUM = [
  '#EF4444',
  '#F97316',
  '#FBBF24',
  '#84CC16',
  '#10B981',
  '#06B6D4',
  '#3B82F6',
  '#6366F1',
  '#8B5CF6',
  '#EC4899',
];

const OPACITY_PRESETS = [
  { label: '100%', alpha: 'FF' },
  { label: '75%', alpha: 'BF' },
  { label: '50%', alpha: '80' },
  { label: '25%', alpha: '40' },
  { label: '15%', alpha: '26' },
];

export const ColorPicker: React.FC<ColorPickerProps> = ({ value, onChange }) => {
  const { colors } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);

  const isTransparent = value === 'transparent';
  const displayColor = value && !isTransparent ? value : '#000000';

  const applyAlpha = (alphaHex: string) => {
    let base = (value || '#F59E0B').trim();
    if (base.startsWith('#')) {
      if (base.length === 9) {
        base = base.slice(0, 7);
      } else if (base.length === 4) {
        base = `#${base[1]}${base[1]}${base[2]}${base[2]}${base[3]}${base[3]}`;
      }
      if (base.length === 7) {
        const withAlpha = alphaHex === 'FF' ? base : `${base}${alphaHex}`;
        onChange(withAlpha);
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* Row Control: Swatch + Hex Input */}
      <View style={styles.row}>
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          activeOpacity={0.7}
          style={[
            styles.swatchBtn,
            {
              borderColor: colors.border,
              backgroundColor: isTransparent ? 'transparent' : displayColor,
            },
          ]}
        >
          {isTransparent && <View style={[styles.transparentSlash, { backgroundColor: colors.accent }]} />}
        </TouchableOpacity>

        <TextInput
          style={[
            styles.hexInput,
            {
              color: colors.textPrimary,
              borderColor: colors.border,
              backgroundColor: colors.surface,
            },
          ]}
          value={value ?? ''}
          placeholder={isTransparent ? 'transparent' : 'inherit'}
          placeholderTextColor={colors.textMuted}
          onChangeText={onChange}
          autoCapitalize="none"
          autoCorrect={false}
          selectTextOnFocus
        />
      </View>

      {/* Modal Dialog */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={() => setModalVisible(false)}
          />

          <View
            style={[
              styles.modalCard,
              {
                backgroundColor: colors.surface,
                borderColor: colors.glassBorderColor,
              },
            ]}
          >
            {/* Header */}
            <View style={styles.modalHeader}>
              <View style={styles.previewRow}>
                <View
                  style={[
                    styles.previewSwatch,
                    {
                      borderColor: colors.border,
                      backgroundColor: isTransparent ? 'transparent' : displayColor,
                    },
                  ]}
                >
                  {isTransparent && (
                    <View style={[styles.transparentSlash, { backgroundColor: colors.accent }]} />
                  )}
                </View>
                <View>
                  <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
                    {value ? String(value).toUpperCase() : 'INHERITED'}
                  </Text>
                  <Text style={[styles.modalSubtitle, { color: colors.textMuted }]}>
                    Select or customize color
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeBtn}
                hitSlop={8}
              >
                <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M18 6L6 18M6 6l12 12"
                    stroke={colors.textSecondary}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
              </TouchableOpacity>
            </View>

            {/* Accents Grid */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>ACCENT PALETTE</Text>
              <View style={styles.swatchGrid}>
                {PRESET_ACCENTS.map((hex) => {
                  const isSelected = value?.toUpperCase() === hex.toUpperCase();
                  return (
                    <TouchableOpacity
                      key={hex}
                      onPress={() => onChange(hex)}
                      activeOpacity={0.7}
                      style={[
                        styles.gridSwatch,
                        { backgroundColor: hex },
                        isSelected && { borderColor: colors.textPrimary, borderWidth: 2 },
                      ]}
                    />
                  );
                })}
              </View>
            </View>

            {/* Neutrals & Special Grid */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>NEUTRALS & MONO</Text>
              <View style={styles.swatchGrid}>
                {PRESET_NEUTRALS.map((hex) => {
                  const isSelected = value?.toUpperCase() === hex.toUpperCase();
                  return (
                    <TouchableOpacity
                      key={hex}
                      onPress={() => onChange(hex)}
                      activeOpacity={0.7}
                      style={[
                        styles.gridSwatch,
                        { backgroundColor: hex },
                        isSelected && { borderColor: colors.accent, borderWidth: 2 },
                      ]}
                    />
                  );
                })}
              </View>
            </View>

            {/* Hue Spectrum */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>HUE SPECTRUM</Text>
              <View style={styles.spectrumRow}>
                {HUE_SPECTRUM.map((hex) => (
                  <TouchableOpacity
                    key={hex}
                    onPress={() => onChange(hex)}
                    activeOpacity={0.7}
                    style={[styles.spectrumBlock, { backgroundColor: hex }]}
                  />
                ))}
              </View>
            </View>

            {/* Opacity / Alpha Modifiers */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>OPACITY & ALPHA</Text>
              <View style={styles.alphaRow}>
                {OPACITY_PRESETS.map((item) => (
                  <TouchableOpacity
                    key={item.label}
                    onPress={() => applyAlpha(item.alpha)}
                    activeOpacity={0.7}
                    style={[styles.alphaBtn, { borderColor: colors.border }]}
                  >
                    <Text style={[styles.alphaText, { color: colors.textSecondary }]}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Quick Actions */}
            <View style={styles.actionsRow}>
              <TouchableOpacity
                onPress={() => onChange('transparent')}
                style={[styles.actionBtn, { borderColor: colors.border }]}
              >
                <Text style={[styles.actionBtnText, { color: colors.textPrimary }]}>
                  Transparent
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => onChange('')}
                style={[styles.actionBtn, { borderColor: colors.border }]}
              >
                <Text style={[styles.actionBtnText, { color: colors.textPrimary }]}>
                  Reset to Default
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={[styles.doneBtn, { backgroundColor: colors.accent }]}
              >
                <Text style={styles.doneBtnText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-end',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  swatchBtn: {
    width: 26,
    height: 26,
    borderRadius: RADII.sm,
    borderWidth: 1.5,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  transparentSlash: {
    width: 2,
    height: 36,
    transform: [{ rotate: '45deg' }],
  },
  hexInput: {
    width: 98,
    height: 30,
    borderWidth: 1,
    borderRadius: RADII.sm + 2,
    paddingHorizontal: 6,
    paddingVertical: 0,
    fontSize: 11,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  modalCard: {
    width: '100%',
    maxWidth: 320,
    borderRadius: RADII.xl,
    padding: SPACING.md,
    borderWidth: 1,
    gap: SPACING.sm + 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: SPACING.xs,
  },
  previewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  previewSwatch: {
    width: 34,
    height: 34,
    borderRadius: RADII.sm + 2,
    borderWidth: 1.5,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  modalSubtitle: {
    fontSize: 11,
  },
  closeBtn: {
    padding: 4,
  },
  section: {
    gap: 6,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  swatchGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
  },
  gridSwatch: {
    width: 32,
    height: 32,
    borderRadius: RADII.sm,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  spectrumRow: {
    flexDirection: 'row',
    height: 20,
    borderRadius: RADII.sm,
    overflow: 'hidden',
  },
  spectrumBlock: {
    flex: 1,
    height: '100%',
  },
  alphaRow: {
    flexDirection: 'row',
    gap: 6,
  },
  alphaBtn: {
    flex: 1,
    borderWidth: 1,
    borderRadius: RADII.sm,
    paddingVertical: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alphaText: {
    fontSize: 11,
    fontWeight: '600',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: SPACING.xs,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: SPACING.xs + 2,
    borderWidth: 1,
    borderRadius: RADII.sm + 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnText: {
    fontSize: 11,
    fontWeight: '600',
  },
  doneBtn: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderRadius: RADII.sm + 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneBtnText: {
    color: '#000000',
    fontWeight: '700',
    fontSize: 12,
  },
});

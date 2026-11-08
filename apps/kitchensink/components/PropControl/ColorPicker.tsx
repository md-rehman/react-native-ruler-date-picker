import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal } from 'react-native';
import ColorPickerComponent, { Panel1, HueSlider, Preview } from 'reanimated-color-picker';
import { useTheme } from '../../context/ThemeContext';
import { RADII, SPACING } from '../../theme/tokens';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ value, onChange }) => {
  const { colors } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);

  const displayColor = value || '#000000';

  const handleSelectColor = (result: { hex: string }) => {
    onChange(result.hex);
  };

  return (
    <View>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        activeOpacity={0.8}
        style={[styles.swatchBtn, { borderColor: colors.border }]}
      >
        <View style={[styles.swatchColor, { backgroundColor: displayColor }]} />
        <Text style={[styles.hexText, { color: colors.textPrimary }]}>
          {displayColor.toUpperCase()}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            onPress={() => setModalVisible(false)}
          />
          <View style={[styles.modalCard, { backgroundColor: colors.bg, borderColor: colors.glassBorderColor }]}>
            <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Select Color</Text>

            <View style={styles.pickerContainer}>
              <ColorPickerComponent value={displayColor} onComplete={handleSelectColor}>
                <Preview style={styles.preview} textStyle={{ color: '#fff' }} />
                <Panel1 style={styles.panel} />
                <HueSlider style={styles.slider} />
              </ColorPickerComponent>
            </View>

            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={[styles.doneBtn, { backgroundColor: colors.accent }]}
            >
              <Text style={styles.doneBtnText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  swatchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADII.md,
    borderWidth: 1,
    gap: SPACING.xs + 2,
  },
  swatchColor: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  hexText: {
    fontSize: 12,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    width: 280,
    borderRadius: RADII.xl,
    padding: SPACING.md,
    borderWidth: 1,
    alignItems: 'center',
    gap: SPACING.md,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  pickerContainer: {
    width: '100%',
    gap: SPACING.sm,
  },
  preview: {
    height: 32,
    borderRadius: RADII.sm,
    marginBottom: SPACING.xs,
  },
  panel: {
    height: 140,
    borderRadius: RADII.md,
    marginBottom: SPACING.xs,
  },
  slider: {
    height: 24,
    borderRadius: RADII.sm,
  },
  doneBtn: {
    width: '100%',
    paddingVertical: SPACING.sm + 2,
    borderRadius: RADII.md,
    alignItems: 'center',
  },
  doneBtnText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
});

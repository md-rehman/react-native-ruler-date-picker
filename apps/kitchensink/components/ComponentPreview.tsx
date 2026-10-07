import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { RulerDatePicker } from 'react-native-ruler-date-picker';
import { useTheme } from '../context/ThemeContext';
import { RADII, SPACING } from '../theme/tokens';

interface ComponentPreviewProps {
  pickerProps: Record<string, any>;
}

export const ComponentPreview: React.FC<ComponentPreviewProps> = ({ pickerProps }) => {
  const { colors } = useTheme();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const formattedDate = selectedDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const previewBg = pickerProps.backgroundColor || colors.bg;

  return (
    <View style={styles.outerContainer} pointerEvents="box-none">
      <View style={[styles.card, { backgroundColor: previewBg, borderColor: colors.glassBorderColor }]}>
        <View style={styles.header}>
          <Text style={[styles.dateText, { color: pickerProps.labelColor || colors.textPrimary }]}>
            {formattedDate}
          </Text>
        </View>
        <View style={styles.pickerWrapper}>
          <RulerDatePicker
            key={JSON.stringify(pickerProps)}
            {...pickerProps}
            selectedDate={selectedDate}
            onSelectDate={(d) => setSelectedDate(d)}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.md,
  },
  card: {
    width: '100%',
    maxWidth: 500,
    borderRadius: RADII.xl,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.md,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 6,
    alignItems: 'center',
  },
  header: {
    marginBottom: SPACING.md,
    alignItems: 'center',
  },
  dateText: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  pickerWrapper: {
    width: '100%',
    alignItems: 'center',
  },
});

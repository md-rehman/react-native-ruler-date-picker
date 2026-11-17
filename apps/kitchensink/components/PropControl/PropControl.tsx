import React from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, Platform } from 'react-native';
import { PropDefinition } from '../../data/propDefinitions';
import { useTheme } from '../../context/ThemeContext';
import { BooleanToggle } from './BooleanToggle';
import { ColorPicker } from './ColorPicker';
import { NumberInput } from './NumberInput';
import { EnumSelect } from './EnumSelect';
import { OffsetInput } from './OffsetInput';
import { ExperimentalBadge } from '../ExperimentalBadge/ExperimentalBadge';
import { RADII, SPACING } from '../../theme/tokens';

interface PropControlProps {
  definition: PropDefinition;
  value: any;
  onChange: (value: any) => void;
}

export const PropControl: React.FC<PropControlProps> = ({ definition, value, onChange }) => {
  const { colors } = useTheme();

  const renderControl = () => {
    switch (definition.type) {
      case 'boolean':
        return <BooleanToggle value={Boolean(value)} onChange={onChange} />;
      case 'color':
        return <ColorPicker value={value} onChange={onChange} />;
      case 'number':
        return (
          <NumberInput
            value={typeof value === 'number' ? value : definition.defaultValue ?? 0}
            onChange={onChange}
            min={definition.min}
            max={definition.max}
            step={definition.step}
          />
        );
      case 'offset':
        return <OffsetInput value={value} onChange={onChange} />;
      case 'enum':
        return (
          <EnumSelect
            value={value}
            options={definition.options || []}
            onChange={onChange}
          />
        );
      case 'tick-rules':
        if (typeof value === 'string') {
          return (
            <EnumSelect
              value={value}
              options={['calendar', 'metric', 'minimal']}
              onChange={onChange}
            />
          );
        }
        return (
          <Text style={[styles.readonlyText, { color: colors.accent }]}>
            Custom Rules
          </Text>
        );
      case 'text':
      case 'date':
        return (
          <TextInput
            style={[
              styles.textInput,
              {
                color: colors.textPrimary,
                borderColor: colors.border,
                backgroundColor: colors.surface,
              },
            ]}
            value={value !== undefined ? String(value) : ''}
            onChangeText={onChange}
            placeholder={String(definition.defaultValue || '')}
            placeholderTextColor={colors.textMuted}
            selectTextOnFocus
          />
        );
      case 'readonly':
        return (
          <Text style={[styles.readonlyText, { color: colors.textMuted }]}>
            {value ? String(value) : 'Dynamic'}
          </Text>
        );
      default:
        return null;
    }
  };

  const isFullWidth = definition.type === 'tick-rules';
  const displayLabel = definition.label.replace(/^(theme|header|value)\./, '');

  return (
    <View style={[styles.container, isFullWidth && styles.containerFullWidth]}>
      <View style={styles.header}>
        <View style={styles.labelRow}>
          <Text style={[styles.label, { color: colors.textSecondary }]} numberOfLines={1}>
            {displayLabel}
          </Text>
          {definition.isExperimental && <ExperimentalBadge size="sm" />}
        </View>
        {definition.description && (
          <TouchableOpacity
            style={[
              styles.tooltipBtn,
              {
                borderColor: colors.glassBorderColor,
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
              },
            ]}
            onPress={() => Alert.alert(definition.label, definition.description)}
            hitSlop={8}
            activeOpacity={0.7}
          >
            <Text style={[styles.tooltipText, { color: colors.textMuted }]}>?</Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={[styles.controlWrapper, isFullWidth && styles.controlWrapperFull]}>
        {renderControl()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 34,
    paddingVertical: 3,
    paddingHorizontal: 2,
    gap: 12,
  },
  containerFullWidth: {
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: 6,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
    minWidth: 0,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexShrink: 1,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  tooltipBtn: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tooltipText: {
    fontSize: 9,
    fontWeight: '700',
    lineHeight: 11,
  },
  controlWrapper: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  controlWrapperFull: {
    alignItems: 'stretch',
  },
  readonlyText: {
    fontSize: 12,
    fontStyle: 'italic',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  textInput: {
    width: 110,
    height: 30,
    borderWidth: 1,
    borderRadius: RADII.sm + 2,
    paddingHorizontal: 8,
    paddingVertical: 0,
    fontSize: 12,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    textAlign: 'center',
  },
});


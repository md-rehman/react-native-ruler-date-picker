import React from 'react';
import { StyleSheet, View, Text, TextInput } from 'react-native';
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
              { color: colors.textPrimary, borderColor: colors.border },
            ]}
            value={value !== undefined ? String(value) : ''}
            onChangeText={onChange}
            placeholder={String(definition.defaultValue || '')}
            placeholderTextColor={colors.textMuted}
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

  return (
    <View style={styles.container}>
      <View style={styles.labelWrapper}>
        <View style={styles.labelRow}>
          <Text style={[styles.label, { color: colors.textPrimary }]}>{definition.label}</Text>
          {definition.isExperimental && (
            <ExperimentalBadge size="sm" />
          )}
        </View>
        {definition.description && (
          <Text style={[styles.description, { color: colors.textMuted }]}>
            {definition.description}
          </Text>
        )}
      </View>
      <View style={styles.controlWrapper}>{renderControl()}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.xs + 2,
    paddingHorizontal: SPACING.md,
  },
  labelWrapper: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
  },
  description: {
    fontSize: 11,
    marginTop: 2,
  },
  controlWrapper: {
    alignItems: 'flex-end',
  },
  readonlyText: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  textInput: {
    borderWidth: 1,
    borderRadius: RADII.md,
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontSize: 12,
    minWidth: 90,
    textAlign: 'right',
  },
});

import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { PropDefinition } from '../../data/propDefinitions';
import { useTheme } from '../../context/ThemeContext';
import { BooleanToggle } from './BooleanToggle';
import { ColorPicker } from './ColorPicker';
import { NumberInput } from './NumberInput';
import { EnumSelect } from './EnumSelect';
import { SPACING } from '../../theme/tokens';

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
        return <BooleanToggle value={value} onChange={onChange} />;
      case 'color':
        return <ColorPicker value={value} onChange={onChange} />;
      case 'number':
        return (
          <NumberInput
            value={value}
            onChange={onChange}
            min={definition.min}
            max={definition.max}
            step={definition.step}
          />
        );
      case 'enum':
        return (
          <EnumSelect
            value={value}
            options={definition.options || []}
            onChange={onChange}
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
        <Text style={[styles.label, { color: colors.textPrimary }]}>{definition.label}</Text>
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
});
